"use client";

import { useActionState, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { IconMail } from "@/components/ui/icons";
import { resendVerificationAction, verifyCodeAction } from "@/lib/actions/auth";
import { IDLE } from "@/lib/actions/types";

/**
 * Aviso de correo sin confirmar. Es un recordatorio, no un portón: la cuenta
 * funciona igual. Lo único que desbloquea confirmar es ver las compras hechas
 * en el mostrador antes de crear la cuenta.
 *
 * El código de 6 dígitos se escribe acá mismo; el link del correo es el
 * atajo para quien lo abre en el teléfono.
 */

const Confirmar = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="shrink-0 rounded-btn bg-ink px-5 py-2.5 font-display text-sm font-semibold text-white transition-colors hover:bg-brand-500 disabled:opacity-60"
    >
      {pending ? "Confirmando…" : "Confirmar"}
    </button>
  );
};

export const VerifyBanner = ({ email }: { email: string | null }) => {
  const [reenvio, setReenvio] = useState("");
  const [pending, startTransition] = useTransition();
  const [estado, confirmar] = useActionState(verifyCodeAction, IDLE);

  const reenviar = () =>
    startTransition(async () => {
      const result = await resendVerificationAction();
      setReenvio(result.message);
    });

  return (
    <div className="rounded-card border border-brand-200 bg-brand-50 p-5">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-brand-500">
          <IconMail className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="font-display text-sm font-semibold text-ink">Confirmá tu correo</p>
          <p className="mt-1 text-sm text-ink-body">
            {reenvio ||
              `Te mandamos un código de 6 dígitos a ${email ?? "tu correo"}. Al confirmarlo vas a ver también tus compras del mostrador.`}
          </p>
        </div>
      </div>

      <form action={confirmar} className="mt-4 flex flex-wrap items-center gap-2">
        <input
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="000000"
          aria-label="Código de verificación"
          className="w-[140px] rounded-btn border border-brand-200 bg-white px-4 py-2.5 text-center font-mono text-lg tracking-[0.3em] text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-ink"
        />
        <Confirmar />

        <button
          type="button"
          onClick={reenviar}
          disabled={pending}
          className="rounded-btn px-3 py-2.5 font-display text-sm font-semibold text-ink-soft underline underline-offset-2 transition-colors hover:text-ink disabled:opacity-60"
        >
          {pending ? "Enviando…" : "Mandame otro"}
        </button>
      </form>

      {estado.message ? (
        <p
          role="status"
          className={`mt-2 text-sm ${estado.ok ? "text-success" : "text-brand-700"}`}
        >
          {estado.message}
        </p>
      ) : null}
    </div>
  );
};
