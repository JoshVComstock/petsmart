"use client";

import { useActionState, useState } from "react";
import { PetCarnet } from "./PetCarnet";
import { savePetAction, type PetFormState } from "@/lib/actions/grooming";
import { IDLE } from "@/lib/actions/types";
import { SPECIES_OPTIONS } from "@/lib/pets";
import { IconCamera, IconFemale, IconMale, IconPaw } from "@/components/ui/icons";
import type { Pet, PetSpecies, SizeKey } from "@/lib/types";

const TAMANOS: { value: SizeKey; label: string; hint: string; paw: string }[] = [
  { value: "SMALL", label: "Pequeño", hint: "Hasta 10 kg", paw: "h-4 w-4" },
  { value: "MEDIUM", label: "Mediano", hint: "10 a 25 kg", paw: "h-5 w-5" },
  { value: "LARGE", label: "Grande", hint: "Más de 25 kg", paw: "h-7 w-7" },
];

const SEXOS = [
  { value: "MALE", label: "Macho", Icon: IconMale },
  { value: "FEMALE", label: "Hembra", Icon: IconFemale },
  { value: "UNKNOWN", label: "No sé", Icon: IconPaw },
] as const;

const ACTIVIDAD = [
  { value: "", label: "Sin especificar" },
  { value: "LOW", label: "Tranquilo" },
  { value: "MODERATE", label: "Normal" },
  { value: "HIGH", label: "Muy activo" },
];

const CONDICION = [
  { value: "", label: "Sin especificar" },
  { value: "UNDERWEIGHT", label: "Bajo peso" },
  { value: "IDEAL", label: "Ideal" },
  { value: "OVERWEIGHT", label: "Sobrepeso" },
];

const inputClass =
  "mt-1.5 w-full rounded-btn border border-line bg-white px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft focus:border-ink focus:ring-2 focus:ring-brand-200";

const Field = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <label className="block">
    <span className="font-display text-sm font-semibold text-ink">{label}</span>
    {hint ? <span className="ml-1.5 text-xs text-ink-soft">{hint}</span> : null}
    {children}
  </label>
);

const Select = ({
  name,
  defaultValue,
  options,
}: {
  name: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
}) => (
  <select name={name} defaultValue={defaultValue} className={inputClass}>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

/** Meses cumplidos, para que el carnet muestre la edad mientras se elige la fecha. */
const monthsSince = (iso: string): number | null => {
  if (!iso) return null;
  const born = new Date(iso);
  if (Number.isNaN(born.getTime())) return null;

  const now = new Date();
  const months =
    (now.getFullYear() - born.getFullYear()) * 12 + (now.getMonth() - born.getMonth());

  return Math.max(0, now.getDate() < born.getDate() ? months - 1 : months);
};

interface Props {
  pet?: Pet;
  onSaved: (pet?: Pet) => void;
  onCancel: () => void;
}

export const PetForm = ({ pet, onSaved, onCancel }: Props) => {
  const [state, submit, sending] = useActionState(
    async (prev: PetFormState, form: FormData) => {
      const result = await savePetAction(prev, form);
      if (result.ok) onSaved(result.pet);
      return result;
    },
    IDLE as PetFormState
  );

  const [name, setName] = useState(pet?.name ?? "");
  const [breed, setBreed] = useState(pet?.breed ?? "");
  const [species, setSpecies] = useState<PetSpecies>(pet?.species ?? "DOG");
  const [size, setSize] = useState<SizeKey>(pet?.size ?? "MEDIUM");
  const [sex, setSex] = useState(pet?.sex ?? "UNKNOWN");
  const [birthDate, setBirthDate] = useState(pet?.birthDate?.slice(0, 10) ?? "");
  const [weight, setWeight] = useState(pet?.weightKg ? String(pet.weightKg) : "");
  const [allergies, setAllergies] = useState(pet?.allergies ?? "");
  const [showDetails, setShowDetails] = useState(false);
  const [fotoPrevia, setFotoPrevia] = useState<string | null>(null);

  const elegirFoto = (archivo: File | undefined) => {
    if (fotoPrevia) URL.revokeObjectURL(fotoPrevia);
    setFotoPrevia(archivo ? URL.createObjectURL(archivo) : null);
  };

  const vistaPrevia: Pet = {
    id: pet?.id ?? 0,
    name,
    breed: breed || null,
    species,
    size,
    sex,
    birthDate: birthDate || null,
    weightKg: weight ? Number(weight) : null,
    allergies: allergies || null,
    ageMonths: monthsSince(birthDate),
    photo: fotoPrevia ?? pet?.photo ?? null,
    isNeutered: pet?.isNeutered ?? null,
    activity: pet?.activity ?? null,
    bodyCondition: pet?.bodyCondition ?? null,
    healthNotes: pet?.healthNotes ?? null,
    dietNotes: pet?.dietNotes ?? null,
    description: pet?.description ?? null,
  };

  return (
    <form action={submit} className="@container">
      {pet ? <input type="hidden" name="id" value={pet.id} /> : null}
      <input type="hidden" name="species" value={species} />
      <input type="hidden" name="size" value={size} />
      <input type="hidden" name="sex" value={sex} />

      <div className="grid gap-6 @3xl:grid-cols-[1fr_320px] @3xl:items-start">
        <div className="order-1 @3xl:order-2 @3xl:sticky @3xl:top-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">
            Así va a quedar
          </p>
          <PetCarnet pet={vistaPrevia} />
        </div>

        <div className="order-2 flex flex-col gap-5 @3xl:order-1">
          <label className="flex items-center gap-4 rounded-card border border-dashed border-line bg-surface px-4 py-3 cursor-pointer transition-colors hover:border-ink-faint">
            <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-white text-brand-400">
              {vistaPrevia.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={vistaPrevia.photo} alt="" className="h-full w-full object-cover" />
              ) : (
                <IconCamera className="h-6 w-6" />
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-sm font-semibold text-ink">
                {vistaPrevia.photo ? "Cambiar la foto" : "Subir una foto"}
              </span>
              <span className="block text-xs text-ink-soft">Aparece en el carnet. Es opcional.</span>
            </span>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={(e) => elegirFoto(e.target.files?.[0])}
              className="sr-only"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre">
              <input
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
                placeholder="Rocky"
                className={inputClass}
              />
            </Field>
            <Field label="Raza" hint="opcional">
              <input
                name="breed"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="Mestizo"
                className={inputClass}
              />
            </Field>
          </div>

          <fieldset>
            <legend className="font-display text-sm font-semibold text-ink">Especie</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {SPECIES_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSpecies(option.value)}
                  aria-pressed={species === option.value}
                  className={`h-10 rounded-pill border px-4 font-display text-sm font-semibold transition-colors ${
                    species === option.value
                      ? "border-ink bg-ink text-white"
                      : "border-line bg-white text-ink-body hover:border-ink-faint hover:bg-surface"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-display text-sm font-semibold text-ink">Tamaño</legend>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {TAMANOS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSize(option.value)}
                  aria-pressed={size === option.value}
                  aria-label={`${option.label}, ${option.hint.toLowerCase()}`}
                  className={`flex flex-col items-center gap-1 rounded-card border px-2 py-3 transition-colors ${
                    size === option.value
                      ? "border-ink bg-surface"
                      : "border-line bg-white hover:bg-surface"
                  }`}
                >
                  <IconPaw
                    className={`${option.paw} ${
                      size === option.value ? "text-brand-500" : "text-ink-faint"
                    }`}
                  />
                  <span className="font-display text-sm font-semibold text-ink">
                    {option.label}
                  </span>
                  <span className="text-[11px] text-ink-soft">{option.hint}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-display text-sm font-semibold text-ink">Sexo</legend>
            <div className="mt-2 inline-flex rounded-pill border border-line bg-white p-1">
              {SEXOS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSex(option.value)}
                  aria-pressed={sex === option.value}
                  className={`inline-flex h-9 items-center gap-1.5 rounded-pill px-3.5 font-display text-sm font-semibold transition-colors ${
                    sex === option.value ? "bg-ink text-white" : "text-ink-body hover:bg-surface"
                  }`}
                >
                  <option.Icon className="h-4 w-4" />
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nacimiento" hint="para la edad">
              <input
                type="date"
                name="birthDate"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Peso" hint="kg">
              <input
                type="number"
                step="0.1"
                min="0"
                name="weightKg"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="28.5"
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Alergias" hint="aparece destacado en el carnet">
            <input
              name="allergies"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="Pollo, cereales…"
              className={inputClass}
            />
          </Field>

          <button
            type="button"
            onClick={() => setShowDetails((value) => !value)}
            className="self-start font-display text-sm font-semibold text-brand-600 underline decoration-brand-200 decoration-2 underline-offset-4 transition-colors hover:decoration-brand-500"
          >
            {showDetails ? "Ocultar los detalles" : "Agregar salud, dieta y carácter"}
          </button>

          {showDetails ? (
            <div className="flex animate-pop flex-col gap-4 rounded-card border border-line bg-surface p-4">
              <p className="text-sm text-ink-soft">
                Cuanto más completes, mejor te podemos recomendar el alimento justo.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nivel de actividad">
                  <Select name="activity" defaultValue={pet?.activity ?? ""} options={ACTIVIDAD} />
                </Field>
                <Field label="Condición corporal">
                  <Select
                    name="bodyCondition"
                    defaultValue={pet?.bodyCondition ?? ""}
                    options={CONDICION}
                  />
                </Field>
              </div>

              <label className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  name="isNeutered"
                  defaultChecked={pet?.isNeutered ?? false}
                  className="h-4 w-4 rounded border-line accent-brand-500"
                />
                <span className="text-sm text-ink-body">Castrado o esterilizado</span>
              </label>

              <Field label="Salud y cuidados">
                <input
                  name="healthNotes"
                  defaultValue={pet?.healthNotes ?? ""}
                  placeholder="Medicación, condiciones…"
                  className={inputClass}
                />
              </Field>

              <Field label="Qué come hoy">
                <input
                  name="dietNotes"
                  defaultValue={pet?.dietNotes ?? ""}
                  placeholder="Marca de alimento, húmedo o seco…"
                  className={inputClass}
                />
              </Field>

              <Field label="Cómo es">
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={pet?.description ?? ""}
                  placeholder="Carácter, rutina, qué le gusta, qué no tolera…"
                  className={inputClass}
                />
              </Field>
            </div>
          ) : null}

          {state.message && !state.ok ? (
            <p
              role="alert"
              className="rounded-btn border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700"
            >
              {state.message}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={sending}
              className="h-12 rounded-btn bg-ink px-7 font-display text-sm font-semibold text-white transition-opacity disabled:opacity-50"
            >
              {sending ? "Guardando…" : pet ? "Guardar cambios" : "Agregar mascota"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="h-12 rounded-btn border border-line px-7 font-display text-sm font-semibold text-ink transition-colors hover:bg-surface"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
