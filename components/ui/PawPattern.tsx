import { IconPaw } from "./icons";

/**
 * Lluvia de huellas que el template usa sobre las manchas naranjas.
 * Las posiciones son fijas a propósito: nada de Math.random, que en SSR
 * daría un valor distinto al del cliente y rompería la hidratación.
 */

const PAWS = [
  { top: "8%", left: "18%", size: 28, rotate: -18, opacity: 0.16 },
  { top: "22%", left: "72%", size: 20, rotate: 24, opacity: 0.12 },
  { top: "38%", left: "8%", size: 34, rotate: 12, opacity: 0.14 },
  { top: "52%", left: "58%", size: 24, rotate: -32, opacity: 0.1 },
  { top: "66%", left: "24%", size: 30, rotate: 8, opacity: 0.13 },
  { top: "78%", left: "78%", size: 22, rotate: -12, opacity: 0.11 },
  { top: "14%", left: "46%", size: 18, rotate: 34, opacity: 0.1 },
  { top: "88%", left: "44%", size: 26, rotate: -6, opacity: 0.12 },
] as const;

export const PawPattern = ({ className = "" }: { className?: string }) => (
  <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
    {PAWS.map((paw) => (
      // El span lleva posición y giro; el ícono solo hereda el tamaño.
      <span
        key={`${paw.top}-${paw.left}`}
        className="absolute block"
        style={{
          top: paw.top,
          left: paw.left,
          width: paw.size,
          height: paw.size,
          opacity: paw.opacity,
          transform: `rotate(${paw.rotate}deg)`,
        }}
      >
        <IconPaw className="h-full w-full" />
      </span>
    ))}
  </div>
);
