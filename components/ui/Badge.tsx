import type { ReactNode } from "react";

/** Etiquetas chicas: descuento, stock, estado. */

type Tone = "brand" | "dark" | "ok" | "low" | "out" | "neutral";

const TONES: Record<Tone, string> = {
  brand: "bg-brand-500 text-white",
  dark: "bg-ink text-white",
  ok: "bg-success/10 text-success",
  low: "bg-brand-50 text-brand-700",
  out: "bg-ink/75 text-white",
  neutral: "bg-surface text-ink-soft",
};

interface Props {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

export const Badge = ({ children, tone = "neutral", className = "" }: Props) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 font-display text-[11px] font-semibold leading-none ${TONES[tone]} ${className}`}
  >
    {children}
  </span>
);
