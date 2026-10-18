"use client";

import { useActionState } from "react";
import { FormField } from "@/components/account/FormField";
import { FormMessage } from "@/components/account/FormMessage";
import { SubmitButton } from "@/components/account/SubmitButton";
import { forgotPasswordAction } from "@/lib/actions/auth";

export const ForgotForm = () => {
  const [state, action] = useActionState(forgotPasswordAction, { ok: false, message: "" });

  return (
    <form action={action} className="flex flex-col gap-4">
      <FormField
        label="Correo de tu cuenta"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="ana@correo.com"
      />

      <FormMessage ok={state.ok} message={state.message} />

      <SubmitButton pendingLabel="Enviando…">Enviarme el link</SubmitButton>
    </form>
  );
};
