import type { ReactNode } from "react";

/**
 * Forma orgánica del template de Figma. En vez de traer un SVG pesado
 * se arma con border-radius asimétrico: pesa cero y escala a cualquier
 * tamaño. Las cuatro variantes son las que usa el diseño.
 */

const SHAPES = [
  "46% 54% 38% 62% / 52% 44% 56% 48%",
  "62% 38% 55% 45% / 45% 58% 42% 55%",
  "38% 62% 46% 54% / 58% 42% 58% 42%",
  "54% 46% 62% 38% / 42% 56% 44% 58%",
] as const;

interface Props {
  /** Cuál de las cuatro formas usar */
  variant?: 0 | 1 | 2 | 3;
  className?: string;
  children?: ReactNode;
}

export const Blob = ({ variant = 0, className = "", children }: Props) => (
  <div className={className} style={{ borderRadius: SHAPES[variant] }}>
    {children}
  </div>
);
