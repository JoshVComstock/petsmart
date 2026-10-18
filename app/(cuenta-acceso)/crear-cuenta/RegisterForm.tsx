"use client";

import { useActionState } from "react";
import { FormField } from "@/components/account/FormField";
import { FormMessage } from "@/components/account/FormMessage";
import { SubmitButton } from "@/components/account/SubmitButton";
import { registerAction } from "@/lib/actions/auth";

export const RegisterForm = ({ next }: { next: string }) => {
  const [state, action] = useActionState(registerAction, { ok: false, message: "" });

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />

      <FormField label="Nombre y apellido" name="name" required autoComplete="name" placeholder="Ana Pérez" />
      <FormField label="Correo" name="email" type="email" required autoComplete="email" placeholder="ana@correo.com" />
      <FormField label="Teléfono" name="phone" type="tel" required autoComplete="tel" placeholder="700 00 000" />
      <FormField
        label="Contraseña"
        name="password"
        type="password"
        required
        autoComplete="new-password"
        placeholder="••••••••"
        hint="Mínimo 8 caracteres"
      />
      <FormField
        label="Repetir contraseña"
        name="repeat"
        type="password"
        required
        autoComplete="new-password"
        placeholder="••••••••"
      />

      <FormMessage ok={state.ok} message={state.message} />

      <SubmitButton pendingLabel="Creando tu cuenta…">Crear cuenta</SubmitButton>
    </form>
  );
};
