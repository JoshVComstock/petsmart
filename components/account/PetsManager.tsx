"use client";

import { useActionState, useState } from "react";
import { PetForm } from "./PetForm";
import { deletePetAction } from "@/lib/actions/grooming";
import { IconPaw, IconPlus, IconTrash } from "@/components/ui/icons";
import { SIZE_LABELS } from "@/lib/config";
import type { Pet } from "@/lib/types";

const ESPECIE_LABELS: Record<string, string> = {
  DOG: "Perro", CAT: "Gato", BIRD: "Ave", FISH: "Pez",
  RODENT: "Roedor", RABBIT: "Conejo", REPTILE: "Reptil", OTHER: "Otro",
};

const edad = (months: number | null) => {
  if (months === null) return null;
  if (months < 12) return `${months} ${months === 1 ? "mes" : "meses"}`;
  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? "año" : "años"}`;
};

const DeletePet = ({ pet }: { pet: Pet }) => {
  const [state, submit, sending] = useActionState(deletePetAction, { ok: false, message: "" });

  return (
    <form action={submit} className="flex items-center gap-2">
      <input type="hidden" name="id" value={pet.id} />
      {state.message && !state.ok ? (
        <span className="text-xs text-brand-600">{state.message}</span>
      ) : null}
      <button
        type="submit"
        disabled={sending}
        aria-label={`Eliminar a ${pet.name}`}
        className="grid h-9 w-9 place-items-center rounded-btn border border-line text-ink-soft transition-colors hover:bg-surface disabled:opacity-50"
      >
        <IconTrash className="h-4 w-4" />
      </button>
    </form>
  );
};

export const PetsManager = ({ pets }: { pets: Pet[] }) => {
  const [editing, setEditing] = useState<Pet | null>(null);
  const [creating, setCreating] = useState(false);

  if (creating || editing) {
    return (
      <div className="rounded-card border border-line bg-white p-5 md:p-7">
        <h2 className="mb-5 font-display text-xl font-semibold text-ink">
          {editing ? `Editar a ${editing.name}` : "Nueva mascota"}
        </h2>
        <PetForm
          pet={editing ?? undefined}
          onDone={() => {
            setEditing(null);
            setCreating(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-ink-soft">
          {pets.length === 0
            ? "Registrá a tus mascotas para reservar turnos y recibir recomendaciones."
            : `${pets.length} ${pets.length === 1 ? "mascota registrada" : "mascotas registradas"}`}
        </p>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-btn bg-ink px-5 font-display text-sm font-semibold text-white"
        >
          <IconPlus className="h-4 w-4" />
          Agregar
        </button>
      </div>

      {pets.length === 0 ? (
        <div className="rounded-card border border-line bg-white px-6 py-14 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-surface text-brand-500">
            <IconPaw className="h-7 w-7" />
          </span>
          <h3 className="mt-5 font-display text-xl font-semibold text-ink">
            Todavía no cargaste ninguna mascota
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
            Con sus datos podemos recomendarte el alimento justo y agendar su peluquería.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {pets.map((pet) => (
            <article key={pet.id} className="rounded-card border border-line bg-white p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-surface text-brand-500">
                  <IconPaw className="h-6 w-6" />
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-lg font-semibold text-ink">{pet.name}</h3>
                  <p className="mt-0.5 text-sm text-ink-soft">
                    {[
                      pet.species ? ESPECIE_LABELS[pet.species] : null,
                      pet.breed,
                      pet.size ? SIZE_LABELS[pet.size] : null,
                      edad(pet.ageMonths),
                    ]
                      .filter(Boolean)
                      .join(" · ") || "Sin datos"}
                  </p>
                </div>

                <DeletePet pet={pet} />
              </div>

              {pet.allergies ? (
                <p className="mt-3 rounded-btn bg-surface px-3 py-2 text-xs text-ink-body">
                  <span className="font-semibold">Alergias:</span> {pet.allergies}
                </p>
              ) : null}

              {pet.description ? (
                <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{pet.description}</p>
              ) : null}

              <button
                type="button"
                onClick={() => setEditing(pet)}
                className="mt-4 font-display text-sm font-semibold text-brand-500"
              >
                Editar datos
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
