"use client";

import { useActionState, useState, useTransition } from "react";
import { FormField } from "./FormField";
import { FormMessage } from "./FormMessage";
import { SubmitButton } from "./SubmitButton";
import { IconMapPin, IconPlus, IconTrash } from "@/components/ui/icons";
import { deleteAddressAction, saveAddressAction } from "@/lib/actions/account";
import type { Address } from "@/lib/types";

/**
 * Alta, edición y baja de direcciones.
 *
 * El único estado local es cuál se está editando; el resto lo maneja la
 * Server Action, que revalida la página y devuelve la lista fresca.
 */

const emptyDraft: Address = {
  id: 0,
  label: "",
  address: "",
  reference: "",
  mapsUrl: "",
  isDefault: false,
};

export const AddressManager = ({ addresses }: { addresses: Address[] }) => {
  // null = formulario cerrado. Un Address = lo que se está editando o creando.
  const [draft, setDraft] = useState<Address | null>(null);
  const [state, action] = useActionState(saveAddressAction, { ok: false, message: "" });
  const [pending, startTransition] = useTransition();

  // El formulario se remonta al cambiar de dirección, así los defaultValue
  // toman el valor nuevo sin necesidad de estado por campo.
  const formKey = draft ? `address-${draft.id}` : "closed";

  const handleDelete = (id: number) => {
    startTransition(() => {
      void deleteAddressAction(id);
    });
  };

  return (
    <div className="flex flex-col gap-5">
      {addresses.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {addresses.map((address) => (
            <li
              key={address.id}
              className="flex items-start justify-between gap-4 rounded-card border border-line bg-white p-5"
            >
              <div className="flex min-w-0 items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-500">
                  <IconMapPin className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 font-display text-base font-semibold text-ink">
                    {address.label}
                    {address.isDefault ? (
                      <span className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-semibold text-ink-soft">
                        Predeterminada
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-1 text-sm text-ink-body">{address.address}</p>
                  {address.reference ? (
                    <p className="mt-0.5 text-sm text-ink-soft">{address.reference}</p>
                  ) : null}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => setDraft(address)}
                  className="rounded-full px-3 py-2 font-display text-xs font-semibold text-ink transition-colors hover:bg-surface"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(address.id)}
                  disabled={pending}
                  aria-label={`Eliminar ${address.label}`}
                  className="rounded-full p-2 text-ink-soft transition-colors hover:bg-surface hover:text-danger disabled:opacity-40"
                >
                  <IconTrash className="h-5 w-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {draft ? (
        <form
          key={formKey}
          action={action}
          className="flex flex-col gap-4 rounded-card border border-line bg-white p-5 md:p-6"
        >
          {draft.id ? <input type="hidden" name="id" value={draft.id} /> : null}

          <h3 className="font-display text-lg font-semibold text-ink">
            {draft.id ? "Editar dirección" : "Nueva dirección"}
          </h3>

          <FormField label="Nombre" name="label" required placeholder="Casa" defaultValue={draft.label} />
          <FormField
            label="Dirección"
            name="address"
            required
            placeholder="Av. Siempre Viva 742"
            defaultValue={draft.address}
          />
          <FormField
            label="Referencia"
            name="reference"
            placeholder="Portón verde, frente a la plaza"
            defaultValue={draft.reference ?? ""}
          />
          <FormField
            label="Link de Google Maps"
            name="mapsUrl"
            placeholder="https://maps.app.goo.gl/…"
            defaultValue={draft.mapsUrl ?? ""}
          />

          <label className="flex items-center gap-2.5 text-sm text-ink-body">
            <input
              type="checkbox"
              name="isDefault"
              defaultChecked={draft.isDefault}
              className="h-4 w-4 accent-brand-500"
            />
            Usar como dirección predeterminada
          </label>

          <FormMessage ok={state.ok} message={state.message} />

          <div className="flex flex-col gap-2 sm:flex-row">
            <SubmitButton pendingLabel="Guardando…">Guardar dirección</SubmitButton>
            <button
              type="button"
              onClick={() => setDraft(null)}
              className="h-[52px] shrink-0 rounded-btn border border-line px-6 font-display text-base font-semibold text-ink transition-colors hover:border-ink sm:w-auto"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setDraft(emptyDraft)}
          className="flex items-center justify-center gap-2.5 rounded-card border border-dashed border-line bg-white py-6 font-display text-base font-semibold text-ink transition-colors hover:border-ink"
        >
          <IconPlus className="h-5 w-5" />
          Agregar una dirección
        </button>
      )}
    </div>
  );
};
