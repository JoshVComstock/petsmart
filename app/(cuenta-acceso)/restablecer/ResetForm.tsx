"use client";

import { useActionState } from "react";
import Link from "next/link";
import { FormField } from "@/components/account/FormField";
import { FormMessage } from "@/components/account/FormMessage";
import { SubmitButton } from "@/components/account/SubmitButton";
import { resetPasswordAction } from "@/lib/actions/auth";

export const ResetForm = ({ token }: { token: string }) => {
  const [state, action] = useActionState(resetPasswordAction, { ok: false, message: "" });

  // Con la contraseña ya cambiada, el formulario deja lugar al link de ingreso.
  if (state.ok) {
    return (
      <div className="flex flex-col gap-5">
        <FormMessage ok message={state.message} />
        <Link
          href="/ingresar"
          className="flex h-[52px] items-center justify-center rounded-btn bg-ink font-display text-base font-semibold text-white transition-colors hover:bg-brand-500"
        >
          Entrar con la contraseña nueva
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="token" value={token} />

      <FormField
        label="Contraseña nueva"
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

      <SubmitButton pendingLabel="Guardando…">Guardar contraseña</SubmitButton>
    </form>
  );
};
