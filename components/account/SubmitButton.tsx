"use client";

import { useFormStatus } from "react-dom";

/**
 * Botón de envío que se deshabilita solo mientras la acción corre.
 * useFormStatus lee el estado del <form> padre: sin estado propio ni efectos.
 */

interface Props {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: "primary" | "brand";
  className?: string;
}

export const SubmitButton = ({
  children,
  pendingLabel = "Enviando…",
  variant = "primary",
  className = "",
}: Props) => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`flex h-[52px] w-full items-center justify-center gap-2.5 rounded-btn font-display text-base font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
        variant === "brand" ? "bg-brand-500 hover:bg-brand-600" : "bg-ink hover:bg-brand-500"
      } ${className}`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
};
