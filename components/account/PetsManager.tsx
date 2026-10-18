"use client";

import { useActionState, useState } from "react";
import { PetCarnet } from "@/components/pets/PetCarnet";
import { PetForm } from "@/components/pets/PetForm";
// import { PrintCarnetButton } from "@/components/pets/PrintCarnet";
import { deletePetAction } from "@/lib/actions/grooming";
import { IDLE } from "@/lib/actions/types";
import { IconPaw, IconPencil, IconPlus, IconTrash } from "@/components/ui/icons";
import type { Pet } from "@/lib/types";

const CarnetFooter = ({ pet, onEdit }: { pet: Pet; onEdit: () => void }) => {
  const [state, submit, sending] = useActionState(deletePetAction, IDLE);

  return (
    <div className="flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex items-center gap-1.5 font-display text-sm font-semibold text-ink transition-colors hover:text-brand-600"
      >
        <IconPencil className="h-4 w-4" />
        Editar datos
      </button>

      {/*
        Carnet imprimible: la impresión ya funciona (ver @media print en
        globals.css). El botón queda apagado a pedido; se enciende
        descomentando esta línea y el import de arriba.

        <PrintCarnetButton petId={pet.id} />
      */}

      <form action={submit} className="flex items-center gap-2">
        <input type="hidden" name="id" value={pet.id} />
        {state.message && !state.ok ? (
          <span role="alert" className="text-xs text-brand-700">
            {state.message}
          </span>
        ) : null}
        <button
          type="submit"
          disabled={sending}
          aria-label={`Eliminar a ${pet.name}`}
          className="grid h-9 w-9 place-items-center rounded-btn border border-line text-ink-soft transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 disabled:opacity-50"
        >
          <IconTrash className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

export const PetsManager = ({ pets }: { pets: Pet[] }) => {
  const [editing, setEditing] = useState<Pet | null>(null);
  const [creating, setCreating] = useState(false);

  const cerrar = () => {
    setEditing(null);
    setCreating(false);
  };

  if (creating || editing) {
    return (
      <div className="rounded-card border border-line bg-white p-5 md:p-7">
        <h2 className="mb-5 font-display text-xl font-semibold text-ink">
          {editing ? `Editar a ${editing.name}` : "Nueva mascota"}
        </h2>
        <PetForm pet={editing ?? undefined} onSaved={cerrar} onCancel={cerrar} />
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
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-btn bg-ink px-5 font-display text-sm font-semibold text-white transition-colors hover:bg-ink-body"
        >
          <IconPlus className="h-4 w-4" />
          Agregar
        </button>
      </div>

      {pets.length === 0 ? (
        <div className="rounded-card border border-line bg-white px-6 py-14 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-50 text-brand-500">
            <IconPaw className="h-7 w-7" />
          </span>
          <h3 className="mt-5 font-display text-xl font-semibold text-ink">
            Todavía no cargaste ninguna mascota
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
            Armá su carnet y con esos datos te recomendamos el alimento justo y agendamos su
            peluquería.
          </p>
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="mt-6 inline-flex h-12 items-center gap-2 rounded-btn bg-ink px-7 font-display text-sm font-semibold text-white"
          >
            <IconPlus className="h-4 w-4" />
            Armar el primer carnet
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {pets.map((pet) => (
            <PetCarnet
              key={pet.id}
              pet={pet}
              footer={<CarnetFooter pet={pet} onEdit={() => setEditing(pet)} />}
            />
          ))}
        </div>
      )}
    </div>
  );
};
