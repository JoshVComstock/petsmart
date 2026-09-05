"use client";

import { useState } from "react";
import { IconCart, IconCheck, IconPlus } from "@/components/ui/icons";
import { useCart } from "@/lib/use-cart";
import type { Product } from "@/lib/types";

interface Props {
  product: Product;
  branchId?: number;
  quantity?: number;
  variant?: "icon" | "full";
  className?: string;
}

export const AddToCartButton = ({
  product,
  branchId,
  quantity = 1,
  variant = "full",
  className = "",
}: Props) => {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const soldOut = product.stock <= 0;

  const handleAdd = () => {
    if (soldOut) return;
    add(product, quantity, branchId);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleAdd}
        disabled={soldOut}
        aria-label={`Agregar ${product.name} al carrito`}
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors duration-200 active:scale-90 disabled:opacity-30 ${
          added ? "bg-success text-white" : "bg-surface text-ink hover:bg-brand-500 hover:text-white"
        } ${className}`}
      >
        {added ? (
          <IconCheck className="h-[18px] w-[18px] animate-[pop_0.28s_ease-out]" />
        ) : (
          <IconPlus className="h-[18px] w-[18px]" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={soldOut}
      className={`flex h-[52px] w-full items-center justify-center gap-2.5 rounded-btn font-display text-base font-semibold transition-colors duration-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-ink-soft md:h-[60px] md:text-lg ${
        added ? "bg-success text-white" : "bg-ink text-white hover:bg-brand-500"
      } ${className}`}
    >
      {soldOut ? (
        "Sin stock"
      ) : added ? (
        <>
          <IconCheck className="h-5 w-5 animate-[pop_0.28s_ease-out]" />
          Agregado al carrito
        </>
      ) : (
        <>
          <IconCart className="h-5 w-5" />
          Agregar al carrito
        </>
      )}
    </button>
  );
};
