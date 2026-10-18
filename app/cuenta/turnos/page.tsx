import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { CancelAppointment } from "@/components/account/CancelAppointment";
import { IconClock, IconMapPin, IconPaw, IconScissors } from "@/components/ui/icons";
import { SIZE_LABELS } from "@/lib/config";
import { apiGet } from "@/lib/store-api";
import type { Appointment } from "@/lib/types";

export const metadata: Metadata = { title: "Mis turnos" };

const ESTADOS: Record<Appointment["status"], { label: string; className: string }> = {
  PENDING:   { label: "Por confirmar", className: "bg-amber-50 text-amber-700 border-amber-200" },
  CONFIRMED: { label: "Confirmado",    className: "bg-blue-50 text-blue-700 border-blue-200" },
  DONE:      { label: "Atendido",      className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  CANCELLED: { label: "Cancelado",     className: "bg-surface-2 text-ink-soft border-line" },
  NO_SHOW:   { label: "No asistió",    className: "bg-surface-2 text-ink-soft border-line" },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("es-BO", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

const Card = ({ appointment }: { appointment: Appointment }) => {
  const estado = ESTADOS[appointment.status];

  return (
    <article className="rounded-card border border-line bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-btn bg-brand-50 text-brand-500">
            <IconScissors className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="font-display text-sm font-semibold capitalize text-ink">
              {formatDate(appointment.scheduledAt)}
            </p>
            <p className="mt-0.5 text-xs text-ink-soft">{appointment.durationMin} min</p>
          </div>
        </div>

        <span
          className={`rounded-full border px-3 py-1 font-display text-[11px] font-semibold uppercase ${estado.className}`}
        >
          {estado.label}
        </span>
      </div>

      <dl className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="flex items-center gap-2 text-xs">
          <IconPaw className="h-4 w-4 shrink-0 text-ink-faint" />
          <span className="text-ink-body">
            {appointment.pet?.name ?? "Sin mascota"}
            {appointment.service ? ` · ${SIZE_LABELS[appointment.service.size]}` : ""}
          </span>
        </div>

        {appointment.branch ? (
          <div className="flex items-center gap-2 text-xs">
            <IconMapPin className="h-4 w-4 shrink-0 text-ink-faint" />
            <span className="text-ink-body">{appointment.branch.name}</span>
          </div>
        ) : null}
      </dl>

      {appointment.service ? (
        <p className="mt-3 line-clamp-2 text-xs text-ink-soft">{appointment.service.description}</p>
      ) : null}

      {appointment.extras.length > 0 ? (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {appointment.extras.map((extra) => (
            <li
              key={extra.id}
              className="rounded-full border border-line px-2.5 py-1 text-[11px] font-medium text-ink-body"
            >
              {extra.name} +{extra.price.toFixed(2)} Bs
            </li>
          ))}
        </ul>
      ) : null}

      {appointment.notes ? (
        <p className="mt-2 rounded-btn bg-surface px-3 py-2 text-xs text-ink-body">
          {appointment.notes}
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
        <span className="font-display text-base font-semibold text-ink">
          {appointment.estimatedPrice?.toFixed(2) ?? "—"} Bs
        </span>

        {appointment.upcoming ? <CancelAppointment id={appointment.id} /> : null}
      </div>
    </article>
  );
};

const AppointmentsPage = async () => {
  const { data } = await apiGet<Appointment[]>("/account/appointments");
  const appointments = data ?? [];

  const proximos = appointments.filter((item) => item.upcoming);
  const pasados = appointments.filter((item) => !item.upcoming);

  if (appointments.length === 0) {
    return (
      <EmptyState
        icon={<IconScissors className="h-7 w-7" />}
        title="Todavía no reservaste ningún turno"
        message="Elegí un servicio de peluquería y reservá el horario que prefieras."
        actionHref="/cuenta/turnos/reservar"
        actionLabel="Reservar un turno"
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section>
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
            <IconClock className="h-5 w-5 text-brand-500" />
            Próximos turnos
          </h2>
          <Link
            href="/cuenta/turnos/reservar"
            className="rounded-btn bg-ink px-5 py-2.5 font-display text-sm font-semibold text-white"
          >
            Reservar otro
          </Link>
        </div>

        {proximos.length === 0 ? (
          <p className="mt-4 rounded-card border border-line bg-surface px-5 py-8 text-center text-sm text-ink-soft">
            No tenés turnos próximos.
          </p>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {proximos.map((item) => (
              <Card key={item.id} appointment={item} />
            ))}
          </div>
        )}
      </section>

      {pasados.length > 0 ? (
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">Historial</h2>
          <div className="mt-3 flex flex-col gap-3">
            {pasados.map((item) => (
              <Card key={item.id} appointment={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default AppointmentsPage;
