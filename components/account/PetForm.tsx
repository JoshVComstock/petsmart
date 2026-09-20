"use client";

import { useActionState, useState } from "react";
import { savePetAction } from "@/lib/actions/grooming";
import type { Pet } from "@/lib/types";

const ESPECIES = [
  { value: "DOG", label: "Perro" },
  { value: "CAT", label: "Gato" },
  { value: "BIRD", label: "Ave" },
  { value: "FISH", label: "Pez" },
  { value: "RODENT", label: "Roedor" },
  { value: "RABBIT", label: "Conejo" },
  { value: "REPTILE", label: "Reptil" },
  { value: "OTHER", label: "Otro" },
];

const TAMANOS = [
  { value: "SMALL", label: "Pequeño" },
  { value: "MEDIUM", label: "Mediano" },
  { value: "LARGE", label: "Grande" },
];

const SEXOS = [
  { value: "UNKNOWN", label: "Sin especificar" },
  { value: "MALE", label: "Macho" },
  { value: "FEMALE", label: "Hembra" },
];

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

const labelClass = "font-display text-sm font-semibold text-ink";
const inputClass =
  "mt-1.5 w-full rounded-btn border border-line px-4 py-2.5 text-sm text-ink outline-none focus:border-ink";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className={labelClass}>{label}</span>
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

export const PetForm = ({ pet, onDone }: { pet?: Pet; onDone: () => void }) => {
  const [state, submit, sending] = useActionState(savePetAction, { ok: false, message: "" });
  const [showDetails, setShowDetails] = useState(false);

  if (state.ok) onDone();

  return (
    <form action={submit} className="flex flex-col gap-5">
      {pet ? <input type="hidden" name="id" value={pet.id} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre">
          <input name="name" defaultValue={pet?.name} required className={inputClass} />
        </Field>
        <Field label="Raza">
          <input name="breed" defaultValue={pet?.breed ?? ""} placeholder="Mestizo" className={inputClass} />
        </Field>
        <Field label="Especie">
          <Select name="species" defaultValue={pet?.species ?? "DOG"} options={ESPECIES} />
        </Field>
        <Field label="Tamaño">
          <Select name="size" defaultValue={pet?.size ?? "MEDIUM"} options={TAMANOS} />
        </Field>
      </div>

      <button
        type="button"
        onClick={() => setShowDetails((value) => !value)}
        className="self-start font-display text-sm font-semibold text-brand-500"
      >
        {showDetails ? "Ocultar detalles" : "Agregar más detalles"}
      </button>

      {showDetails ? (
        <div className="flex flex-col gap-4 rounded-card border border-line bg-surface p-4">
          <p className="text-sm text-ink-soft">
            Cuanto más completes, mejores van a ser las recomendaciones de productos.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Sexo">
              <Select name="sex" defaultValue={pet?.sex ?? "UNKNOWN"} options={SEXOS} />
            </Field>
            <Field label="Fecha de nacimiento">
              <input
                type="date"
                name="birthDate"
                defaultValue={pet?.birthDate?.slice(0, 10) ?? ""}
                className={inputClass}
              />
            </Field>
            <Field label="Peso (kg)">
              <input
                type="number"
                step="0.1"
                min="0"
                name="weightKg"
                defaultValue={pet?.weightKg ?? ""}
                className={inputClass}
              />
            </Field>
            <Field label="Nivel de actividad">
              <Select name="activity" defaultValue={pet?.activity ?? ""} options={ACTIVIDAD} />
            </Field>
            <Field label="Condición corporal">
              <Select name="bodyCondition" defaultValue={pet?.bodyCondition ?? ""} options={CONDICION} />
            </Field>
            <label className="flex items-center gap-2 self-end pb-2">
              <input
                type="checkbox"
                name="isNeutered"
                defaultChecked={pet?.isNeutered ?? false}
                className="h-4 w-4 rounded border-line"
              />
              <span className="text-sm text-ink-body">Castrado / esterilizado</span>
            </label>
          </div>

          <Field label="Alergias">
            <input
              name="allergies"
              defaultValue={pet?.allergies ?? ""}
              placeholder="Pollo, cereales…"
              className={inputClass}
            />
          </Field>

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

          <Field label="Contanos sobre tu mascota">
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
        <p className="rounded-btn border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700">
          {state.message}
        </p>
      ) : null}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={sending}
          className="h-12 rounded-btn bg-ink px-7 font-display text-sm font-semibold text-white disabled:opacity-50"
        >
          {sending ? "Guardando…" : pet ? "Guardar cambios" : "Agregar mascota"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="h-12 rounded-btn border border-line px-7 font-display text-sm font-semibold text-ink"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};
