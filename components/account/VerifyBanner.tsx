"use client";

import { useState, useTransition } from "react";
import { IconMail } from "@/components/ui/icons";
import { resendVerificationAction } from "@/lib/actions/auth";

/**
 * Aviso de correo sin confirmar. Es un recordatorio, no un portón: la cuenta
 * funciona igual. Lo único que desbloquea confirmar es ver las compras hechas
 * en el mostrador antes de crear la cuenta.
 */

export const VerifyBanner = ({ email }: { email: string | null }) => {
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  const handleResend = () => {
    startTransition(async () => {
      const result = await resendVerificationAction();
      setMessage(result.message);
    });
  };

  return (
    <div className="flex flex-col gap-4 rounded-card border border-brand-200 bg-brand-50 p-5 md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-brand-500">
          <IconMail className="h-5 w-5" />
        </span>
        <div>
          <p className="font-display text-sm font-semibold text-ink">Confirmá tu correo</p>
          <p className="mt-1 text-sm text-ink-body">
            {message ||
              `Te mandamos un link a ${email ?? "tu correo"}. Al confirmarlo vas a ver también tus compras del mostrador.`}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleResend}
        disabled={pending}
        className="shrink-0 rounded-btn bg-ink px-5 py-3 font-display text-sm font-semibold text-white transition-colors hover:bg-brand-500 disabled:opacity-60"
      >
        {pending ? "Enviando…" : "Reenviar correo"}
      </button>
    </div>
  );
};
