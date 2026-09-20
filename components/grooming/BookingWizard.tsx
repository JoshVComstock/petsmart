"use client";

import { useActionState, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { IconCheck, IconClock, IconPaw, IconScissors } from "@/components/ui/icons";
import { SIZE_LABELS } from "@/lib/config";
import {
  bookAppointmentAction,
  getAvailabilityAction,
} from "@/lib/actions/grooming";
import type {
  GroomingCatalog,
  GroomingPackage,
  GroomingSlot,
  Pet,
  SizeKey,
} from "@/lib/types";

const PASOS = ["Servicio", "Mascota", "Extras", "Día y hora"] as const;

const toISODate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;

const nextWorkdays = (workdays: number[], maxDays: number, count = 14) => {
  const out: Date[] = [];
  for (let i = 0; i < maxDays && out.length < count; i++) {
    const day = new Date();
    day.setDate(day.getDate() + i);
    day.setHours(0, 0, 0, 0);
    if (workdays.includes(day.getDay())) out.push(day);
  }
  return out;
};

const dayLabel = (date: Date) =>
  date.toLocaleDateString("es-BO", { weekday: "short", day: "2-digit", month: "short" });

interface Props {
  catalog: GroomingCatalog;
  pets: Pet[];
  initialType: string | null;
}

export const BookingWizard = ({ catalog, pets, initialType }: Props) => {
  const { packages, extras, schedule, branch } = catalog;

  const [step, setStep] = useState(0);
  const [pkg, setPkg] = useState<GroomingPackage | null>(
    packages.find((p) => p.type === initialType) ?? null
  );
  const [petId, setPetId] = useState<number | null>(pets[0]?.id ?? null);
  const [size, setSize] = useState<SizeKey | null>(pets[0]?.size ?? null);
  const [extraIds, setExtraIds] = useState<number[]>([]);
  const [date, setDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<GroomingSlot[]>([]);
  const [startsAt, setStartsAt] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [loadingSlots, startLoadingSlots] = useTransition();

  const [state, submit, sending] = useActionState(bookAppointmentAction, {
    ok: false,
    message: "",
  });

  const pet = pets.find((p) => p.id === petId) ?? null;
  const days = useMemo(
    () => nextWorkdays(schedule.workdays, schedule.maxDaysAhead),
    [schedule.workdays, schedule.maxDaysAhead]
  );

  const service = pkg && size ? pkg.prices.find((p) => p.size === size) ?? null : null;
  const chosenExtras = extras.filter((e) => extraIds.includes(e.id));
  const total =
    (service?.price ?? 0) + chosenExtras.reduce((sum, e) => sum + e.price, 0);

  const pickDate = (value: string) => {
    setDate(value);
    setStartsAt(null);
    startLoadingSlots(async () => {
      const result = await getAvailabilityAction(value);
      setSlots(result.slots);
    });
  };

  const pickPet = (selected: Pet) => {
    setPetId(selected.id);
    if (selected.size) setSize(selected.size);
  };

  const canContinue =
    (step === 0 && pkg !== null) ||
    (step === 1 && pet !== null && size !== null) ||
    step === 2 ||
    (step === 3 && startsAt !== null);

  if (state.ok) {
    return (
      <div className="rounded-card border border-line bg-white px-6 py-14 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-50 text-brand-500">
          <IconCheck className="h-8 w-8" />
        </span>
        <h2 className="mt-5 font-display text-2xl font-semibold text-ink">
          ¡Turno reservado!
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">{state.message}</p>
        <p className="mx-auto mt-1 max-w-md text-sm text-ink-soft">
          Te vamos a confirmar por WhatsApp. Podés pagar en la tienda o por QR.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/cuenta/turnos"
            className="inline-flex h-12 items-center rounded-btn bg-ink px-7 font-display text-base font-semibold text-white"
          >
            Ver mis turnos
          </Link>
          <Link
            href="/peluqueria"
            className="inline-flex h-12 items-center rounded-btn border border-line px-7 font-display text-base font-semibold text-ink"
          >
            Volver
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
      <div className="rounded-card border border-line bg-white p-5 md:p-7">
        <ol className="mb-7 flex flex-wrap gap-2">
          {PASOS.map((label, index) => (
            <li
              key={label}
              className={`flex items-center gap-2 rounded-btn px-3 py-1.5 font-display text-xs font-semibold ${
                index === step
                  ? "bg-ink text-white"
                  : index < step
                    ? "bg-brand-50 text-brand-600"
                    : "bg-surface text-ink-faint"
              }`}
            >
              <span>{index + 1}</span>
              {label}
            </li>
          ))}
        </ol>

        {step === 0 ? (
          <div className="flex flex-col gap-3">
            {packages.map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => setPkg(item)}
                className={`flex items-center gap-4 rounded-card border p-4 text-left transition-colors ${
                  pkg?.type === item.type
                    ? "border-ink bg-surface"
                    : "border-line hover:bg-surface"
                }`}
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-btn bg-brand-50 text-brand-500">
                  <IconScissors className="h-6 w-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-base font-semibold text-ink">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block line-clamp-1 text-sm text-ink-soft">
                    {item.description}
                  </span>
                </span>
                <span className="shrink-0 font-display text-sm font-semibold text-brand-500">
                  desde {item.fromPrice.toFixed(2)} Bs
                </span>
              </button>
            ))}
          </div>
        ) : null}

        {step === 1 ? (
          <div className="flex flex-col gap-5">
            {pets.length === 0 ? (
              <div className="rounded-card border border-line bg-surface p-5 text-center">
                <IconPaw className="mx-auto h-9 w-9 text-brand-300" />
                <p className="mt-3 font-display text-base font-semibold text-ink">
                  Todavía no cargaste ninguna mascota
                </p>
                <p className="mt-1 text-sm text-ink-soft">
                  Necesitamos sus datos para reservar el turno.
                </p>
                <Link
                  href="/cuenta/mascotas"
                  className="mt-4 inline-flex h-11 items-center rounded-btn bg-ink px-6 font-display text-sm font-semibold text-white"
                >
                  Agregar mascota
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {pets.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => pickPet(item)}
                    className={`flex items-center gap-3 rounded-card border p-4 text-left transition-colors ${
                      petId === item.id ? "border-ink bg-surface" : "border-line hover:bg-surface"
                    }`}
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-surface-2 text-brand-500">
                      <IconPaw className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-base font-semibold text-ink">
                        {item.name}
                      </span>
                      <span className="block text-sm text-ink-soft">
                        {[item.breed, item.size ? SIZE_LABELS[item.size] : null]
                          .filter(Boolean)
                          .join(" · ") || "Sin datos"}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}

            {pet ? (
              <div>
                <p className="font-display text-sm font-semibold text-ink">
                  Tamaño de {pet.name}
                </p>
                <p className="mt-1 text-sm text-ink-soft">
                  De esto depende el precio del servicio.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {pkg?.prices.map((price) => (
                    <button
                      key={price.size}
                      type="button"
                      onClick={() => setSize(price.size)}
                      className={`rounded-btn border px-4 py-2.5 font-display text-sm font-semibold transition-colors ${
                        size === price.size
                          ? "border-ink bg-ink text-white"
                          : "border-line text-ink hover:bg-surface"
                      }`}
                    >
                      {SIZE_LABELS[price.size]} · {price.price.toFixed(2)} Bs
                    </button>
                  ))}
                </div>
                {pet.size && size && pet.size !== size ? (
                  <p className="mt-2 text-sm text-brand-600">
                    {pet.name} figura como {SIZE_LABELS[pet.size]}. Elegí ese tamaño para
                    que el precio sea correcto.
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}

        {step === 2 ? (
          <div className="flex flex-col gap-2">
            {extras.length === 0 ? (
              <p className="text-sm text-ink-soft">No hay servicios adicionales cargados.</p>
            ) : (
              extras.map((extra) => {
                const checked = extraIds.includes(extra.id);
                return (
                  <button
                    key={extra.id}
                    type="button"
                    onClick={() =>
                      setExtraIds((prev) =>
                        checked ? prev.filter((id) => id !== extra.id) : [...prev, extra.id]
                      )
                    }
                    className={`flex items-center gap-3 rounded-card border p-4 text-left transition-colors ${
                      checked ? "border-ink bg-surface" : "border-line hover:bg-surface"
                    }`}
                  >
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border ${
                        checked ? "border-ink bg-ink text-white" : "border-line"
                      }`}
                    >
                      {checked ? <IconCheck className="h-4 w-4" /> : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-base font-semibold text-ink">
                        {extra.name}
                      </span>
                      {extra.description ? (
                        <span className="block text-sm text-ink-soft">{extra.description}</span>
                      ) : null}
                    </span>
                    <span className="shrink-0 font-display text-sm font-semibold text-brand-500">
                      +{extra.price.toFixed(2)} Bs
                    </span>
                  </button>
                );
              })
            )}
          </div>
        ) : null}

        {step === 3 ? (
          <div className="flex flex-col gap-5">
            <div>
              <p className="font-display text-sm font-semibold text-ink">Elegí el día</p>
              <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
                {days.map((day) => {
                  const value = toISODate(day);
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => pickDate(value)}
                      className={`shrink-0 rounded-btn border px-4 py-2.5 font-display text-sm font-semibold capitalize transition-colors ${
                        date === value
                          ? "border-ink bg-ink text-white"
                          : "border-line text-ink hover:bg-surface"
                      }`}
                    >
                      {dayLabel(day)}
                    </button>
                  );
                })}
              </div>
            </div>

            {date ? (
              <div>
                <p className="font-display text-sm font-semibold text-ink">Elegí la hora</p>
                {loadingSlots ? (
                  <p className="mt-3 text-sm text-ink-soft">Buscando horarios…</p>
                ) : slots.length === 0 ? (
                  <p className="mt-3 text-sm text-ink-soft">No hay turnos ese día.</p>
                ) : (
                  <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {slots.map((slot) => (
                      <button
                        key={slot.startsAt}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setStartsAt(slot.startsAt)}
                        title={slot.reason ?? undefined}
                        className={`rounded-btn border py-2.5 font-display text-sm font-semibold transition-colors ${
                          startsAt === slot.startsAt
                            ? "border-ink bg-ink text-white"
                            : slot.available
                              ? "border-line text-ink hover:bg-surface"
                              : "border-line bg-surface text-ink-faint line-through"
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            <label className="flex flex-col gap-2">
              <span className="font-display text-sm font-semibold text-ink">
                Algo que debamos saber (opcional)
              </span>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
                placeholder="Se pone nervioso con la secadora…"
                className="rounded-btn border border-line px-4 py-3 text-sm text-ink outline-none focus:border-ink"
              />
            </label>
          </div>
        ) : null}

        {state.message && !state.ok ? (
          <p className="mt-5 rounded-btn border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700">
            {state.message}
          </p>
        ) : null}

        <div className="mt-7 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((value) => value - 1)}
            className="h-12 rounded-btn border border-line px-6 font-display text-sm font-semibold text-ink disabled:opacity-40"
          >
            Atrás
          </button>

          {step < 3 ? (
            <button
              type="button"
              disabled={!canContinue}
              onClick={() => setStep((value) => value + 1)}
              className="h-12 rounded-btn bg-ink px-8 font-display text-sm font-semibold text-white disabled:opacity-40"
            >
              Continuar
            </button>
          ) : (
            <form action={submit}>
              <input type="hidden" name="petId" value={petId ?? ""} />
              <input type="hidden" name="serviceId" value={service?.serviceId ?? ""} />
              <input type="hidden" name="startsAt" value={startsAt ?? ""} />
              <input type="hidden" name="notes" value={notes} />
              {extraIds.map((id) => (
                <input key={id} type="hidden" name="extraIds" value={id} />
              ))}
              <button
                type="submit"
                disabled={!canContinue || sending}
                className="h-12 rounded-btn bg-brand-500 px-8 font-display text-sm font-semibold text-white disabled:opacity-40"
              >
                {sending ? "Reservando…" : "Confirmar turno"}
              </button>
            </form>
          )}
        </div>
      </div>

      <aside className="rounded-card border border-line bg-white p-5 lg:sticky lg:top-28">
        <h2 className="font-display text-lg font-semibold text-ink">Tu turno</h2>

        <dl className="mt-4 flex flex-col gap-3 text-sm">
          <div className="flex items-start justify-between gap-3">
            <dt className="text-ink-soft">Servicio</dt>
            <dd className="text-right font-medium text-ink">{pkg?.title ?? "—"}</dd>
          </div>
          <div className="flex items-start justify-between gap-3">
            <dt className="text-ink-soft">Mascota</dt>
            <dd className="text-right font-medium text-ink">{pet?.name ?? "—"}</dd>
          </div>
          <div className="flex items-start justify-between gap-3">
            <dt className="text-ink-soft">Tamaño</dt>
            <dd className="text-right font-medium text-ink">
              {size ? SIZE_LABELS[size] : "—"}
            </dd>
          </div>
          <div className="flex items-start justify-between gap-3">
            <dt className="text-ink-soft">Cuándo</dt>
            <dd className="text-right font-medium text-ink">
              {startsAt
                ? new Date(startsAt).toLocaleString("es-BO", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"}
            </dd>
          </div>
          {branch ? (
            <div className="flex items-start justify-between gap-3">
              <dt className="text-ink-soft">Dónde</dt>
              <dd className="text-right font-medium text-ink">{branch.name}</dd>
            </div>
          ) : null}
        </dl>

        {chosenExtras.length > 0 ? (
          <ul className="mt-4 flex flex-col gap-2 border-t border-line pt-4 text-sm">
            {chosenExtras.map((extra) => (
              <li key={extra.id} className="flex items-center justify-between gap-3">
                <span className="text-ink-soft">{extra.name}</span>
                <span className="font-medium text-ink">+{extra.price.toFixed(2)} Bs</span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
          <span className="font-display text-base font-semibold text-ink">Total</span>
          <span className="font-display text-2xl font-semibold text-brand-500">
            {total.toFixed(2)} Bs
          </span>
        </div>

        <p className="mt-4 flex items-start gap-2 text-xs text-ink-soft">
          <IconClock className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
          Se paga en la tienda o por QR. Reservá con {schedule.minHoursAhead} horas de
          anticipación como mínimo.
        </p>
      </aside>
    </div>
  );
};
