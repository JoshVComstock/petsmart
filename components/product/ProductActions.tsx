"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { AddToCartButton } from "./AddToCartButton";
import { IconMinus, IconPlus } from "@/components/ui/icons";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

/**
 * Selector de cantidad + agregar. En mobile además queda una barra fija
 * abajo para que el botón esté siempre a mano (patrón de app).
 */

interface StepProps {
  children: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const StepButton = ({ children, label, onClick, disabled }: StepProps) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    disabled={disabled}
    className="grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-surface active:scale-90 disabled:opacity-30"
  >
    {children}
  </button>
);

export const ProductActions = ({ product }: { product: Product }) => {
  const [quantity, setQuantity] = useState(1);
  const max = Math.max(1, product.stock);

  const stepper = (
    <div className="flex items-center gap-1 rounded-btn border border-line p-1.5">
      <StepButton label="Quitar uno" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
        <IconMinus className="h-4 w-4" />
      </StepButton>
      <span className="w-10 text-center font-display text-lg font-semibold text-ink">
        {quantity}
      </span>
      <StepButton
        label="Agregar uno"
        disabled={quantity >= max}
        onClick={() => setQuantity((q) => Math.min(max, q + 1))}
      >
        <IconPlus className="h-4 w-4" />
      </StepButton>
    </div>
  );

  return (
    <>
      {/* Bloque normal (desktop y flujo de la página) */}
      <div className="mt-8 hidden items-center gap-4 md:flex">
        {stepper}
        <AddToCartButton product={product} quantity={quantity} className="flex-1" />
      </div>

      {/* Mobile: cantidad en la página… */}
      <div className="mt-8 flex items-center justify-between gap-3 md:hidden">
        <span className="font-display text-sm font-semibold text-ink-soft">Cantidad</span>
        {stepper}
      </div>

      {/* …y barra fija con el total */}
      <div className="fixed inset-x-0 bottom-20 z-30 border-t border-line bg-white/95 px-4 py-3 backdrop-blur-md md:hidden">
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            <p className="text-[11px] text-ink-soft">Total</p>
            <p className="font-display text-lg font-semibold text-ink">
              {formatPrice(product.price * quantity)}
            </p>
          </div>
          <AddToCartButton product={product} quantity={quantity} className="h-12 flex-1 md:h-12" />
        </div>
      </div>
    </>
  );
};
