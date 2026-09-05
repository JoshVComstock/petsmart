"use client";

import Link from "next/link";
import { IconCart } from "@/components/ui/icons";
import { useCart } from "@/lib/use-cart";

/** Carrito del header, con la burbuja naranja del template. */

export const CartButton = () => {
  const { items } = useCart();

  return (
    <Link
      href="/carrito"
      aria-label={`Carrito con ${items} artículos`}
      className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink transition-colors hover:bg-surface"
    >
      <IconCart className="h-6 w-6" />
      {items > 0 ? (
        <span className="absolute right-0 top-0 grid h-[18px] min-w-[18px] place-items-center rounded-full border border-white bg-brand-500 px-1 text-[10px] font-semibold leading-none text-white">
          {items}
        </span>
      ) : null}
    </Link>
  );
};
