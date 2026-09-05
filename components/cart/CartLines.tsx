"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ProductImage } from "@/components/product/ProductImage";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconCart, IconMapPin, IconMinus, IconPlus, IconTrash } from "@/components/ui/icons";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/use-cart";

/** Listado editable del carrito. El estado vive en el store, no acá. */

interface QtyProps {
  children: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const QtyButton = ({ children, label, onClick, disabled }: QtyProps) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    disabled={disabled}
    className="grid h-8 w-8 place-items-center rounded-full text-ink transition-colors hover:bg-surface disabled:opacity-30"
  >
    {children}
  </button>
);

export const CartLines = () => {
  const { lines, setQuantity, remove } = useCart();

  if (lines.length === 0) {
    return (
      <EmptyState
        icon={<IconCart className="h-7 w-7" />}
        title="Tu carrito está vacío"
        message="Agregá productos y coordinamos la entrega por WhatsApp."
        actionHref="/productos"
        actionLabel="Ver productos"
      />
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {lines.map((line) => (
        <li
          key={`${line.productId}-${line.branchId}`}
          className="flex gap-4 rounded-card border border-line bg-white p-4 md:p-5"
        >
          <Link href={`/productos/${line.productId}`} className="shrink-0">
            <ProductImage
              src={line.photo}
              alt={line.name}
              className="h-20 w-20 rounded-[16px] md:h-28 md:w-28"
            />
          </Link>

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-start justify-between gap-2">
              <Link href={`/productos/${line.productId}`} className="min-w-0">
                <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug text-ink transition-colors hover:text-brand-500 md:text-lg">
                  {line.name}
                </h3>
              </Link>

              <button
                type="button"
                onClick={() => remove(line.productId, line.branchId)}
                aria-label={`Quitar ${line.name}`}
                className="shrink-0 rounded-full p-2 text-ink-soft transition-colors hover:bg-surface hover:text-danger"
              >
                <IconTrash className="h-5 w-5" />
              </button>
            </div>

            {line.branchName ? (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-soft">
                <IconMapPin className="h-4 w-4 shrink-0" />
                {line.branchName}
              </p>
            ) : null}

            <div className="mt-auto flex items-end justify-between gap-3 pt-4">
              <div className="flex items-center gap-1 rounded-btn border border-line p-1">
                <QtyButton
                  label="Quitar uno"
                  onClick={() => setQuantity(line.productId, line.quantity - 1, line.branchId)}
                >
                  <IconMinus className="h-4 w-4" />
                </QtyButton>
                <span className="w-8 text-center font-display text-sm font-semibold text-ink">
                  {line.quantity}
                </span>
                <QtyButton
                  label="Agregar uno"
                  disabled={line.quantity >= line.maxStock}
                  onClick={() => setQuantity(line.productId, line.quantity + 1, line.branchId)}
                >
                  <IconPlus className="h-4 w-4" />
                </QtyButton>
              </div>

              <div className="text-right">
                <p className="text-xs text-ink-soft">{formatPrice(line.price)} c/u</p>
                <p className="font-display text-lg font-semibold text-ink">
                  {formatPrice(line.price * line.quantity)}
                </p>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
