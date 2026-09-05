"use client";

import { useActionState } from "react";
import { FormField } from "@/components/account/FormField";
import { FormMessage } from "@/components/account/FormMessage";
import { SubmitButton } from "@/components/account/SubmitButton";
import { loginAction } from "@/lib/actions/auth";

/** Formulario de ingreso. El estado lo maneja useActionState, no useEffect. */

export const LoginForm = ({ next }: { next: string }) => {
  const [state, action] = useActionState(loginAction, { ok: false, message: "" });

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />

      <FormField
        label="Correo"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="ana@correo.com"
      />
      <FormField
        label="Contraseña"
        name="password"
        type="password"
        required
        autoComplete="current-password"
        placeholder="••••••••"
      />

      <FormMessage ok={state.ok} message={state.message} />

      <SubmitButton pendingLabel="Entrando…">Entrar</SubmitButton>
    </form>
  );
};
