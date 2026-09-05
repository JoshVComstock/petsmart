"use client";

import { useActionState } from "react";
import { FormField } from "./FormField";
import { FormMessage } from "./FormMessage";
import { SubmitButton } from "./SubmitButton";
import { changePasswordAction, updateProfileAction } from "@/lib/actions/account";
import type { StoreClient } from "@/lib/types";

/** Datos personales y cambio de contraseña, cada uno con su propio estado. */

export const ProfileForm = ({ client }: { client: StoreClient }) => {
  const [state, action] = useActionState(updateProfileAction, { ok: false, message: "" });

  return (
    <form action={action} className="flex flex-col gap-4 rounded-card border border-line bg-white p-5 md:p-6">
      <h3 className="font-display text-lg font-semibold text-ink">Mis datos</h3>

      <FormField label="Nombre y apellido" name="name" required defaultValue={client.name} />
      <FormField label="Teléfono" name="phone" type="tel" required defaultValue={client.phone} />
      <FormField label="CI / NIT (opcional)" name="ci" defaultValue={client.ci ?? ""} />

      <div>
        <span className="font-display text-xs font-semibold text-ink-soft">Correo</span>
        <p className="mt-1.5 rounded-btn border border-line bg-surface px-4 py-3 text-sm text-ink-soft">
          {client.email}
          {client.emailVerified ? " · confirmado" : " · sin confirmar"}
        </p>
        <span className="mt-1.5 block text-xs text-ink-soft">
          El correo es tu usuario, no se puede cambiar desde acá. Escribinos si lo necesitás.
        </span>
      </div>

      <FormMessage ok={state.ok} message={state.message} />

      <SubmitButton pendingLabel="Guardando…">Guardar cambios</SubmitButton>
    </form>
  );
};

export const PasswordForm = () => {
  const [state, action] = useActionState(changePasswordAction, { ok: false, message: "" });

  return (
    <form action={action} className="flex flex-col gap-4 rounded-card border border-line bg-white p-5 md:p-6">
      <h3 className="font-display text-lg font-semibold text-ink">Cambiar contraseña</h3>

      <FormField
        label="Contraseña actual"
        name="currentPassword"
        type="password"
        required
        autoComplete="current-password"
      />
      <FormField
        label="Contraseña nueva"
        name="newPassword"
        type="password"
        required
        autoComplete="new-password"
        hint="Mínimo 8 caracteres"
      />
      <FormField
        label="Repetir contraseña nueva"
        name="repeat"
        type="password"
        required
        autoComplete="new-password"
      />

      <FormMessage ok={state.ok} message={state.message} />

      <SubmitButton pendingLabel="Guardando…">Cambiar contraseña</SubmitButton>
    </form>
  );
};
