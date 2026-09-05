import { formatPrice } from "@/lib/format";

/**
 * Precio del template: negro, Poppins. El naranja se reserva para
 * acentos (ofertas, nav activa), no para el precio normal.
 */

interface Props {
  value: number;
  oldValue?: number | null;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-[32px] md:text-[40px]",
} as const;

export const Price = ({ value, oldValue, size = "sm" }: Props) => (
  <div className="flex flex-wrap items-baseline gap-2">
    <span className={`font-display font-semibold text-ink ${SIZES[size]}`}>
      {formatPrice(value)}
    </span>
    {oldValue ? (
      <span className="text-sm text-ink-faint line-through">{formatPrice(oldValue)}</span>
    ) : null}
  </div>
);
