"use client";

import Link from "next/link";
import { useState, useTransition, type MouseEvent, type ReactNode } from "react";
import { ProductActions } from "./ProductActions";
import { ProductImage } from "./ProductImage";
import { VariantPicker } from "./VariantPicker";
import { Price } from "@/components/ui/Price";
import { quickViewAction } from "@/lib/actions/quick-view";
import { formatMeasure, stockLabel } from "@/lib/format";
import type { StoreProduct } from "@/lib/types";

/**
 * Vista rápida del producto.
 *
 * Envuelve las tarjetas y atrapa el click en captura, antes de que el Link
 * navegue: en vez de irse a /productos/:id abre la ficha encima. Armar el
 * pedido no saca a nadie de la página en la que está.
 */

const TONOS = {
  ok:  "text-success",
  low: "text-brand-600",
  out: "text-ink-faint",
} as const;

const idDelHref = (href: string | null): number | null => {
  const encontrado = href?.match(/^\/productos\/(\d+)/);
  return encontrado ? Number(encontrado[1]) : null;
};

const Ficha = ({ product }: { product: StoreProduct }) => {
  const medida = formatMeasure(product);
  const stock = stockLabel(product.stock);

  return (
    <div className="flex flex-col gap-5 p-5 md:flex-row md:p-6">
      <div className="w-full shrink-0 overflow-hidden rounded-card bg-surface md:w-60">
        <ProductImage
          src={product.photo}
          alt={product.name}
          className="aspect-square w-full object-cover"
        />
      </div>

      <div className="min-w-0">
        {product.brand ? (
          <p className="font-display text-xs font-semibold uppercase tracking-wide text-brand-500">
            {product.brand.name}
          </p>
        ) : null}

        <h2 className="mt-1 font-display text-xl font-semibold text-ink">{product.name}</h2>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <Price value={product.price} size="md" />
          {medida ? <span className="text-xs text-ink-soft">{medida}</span> : null}
          <span className={`text-xs font-semibold ${TONOS[stock.tone]}`}>{stock.text}</span>
        </div>

        {product.description ? (
          <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-ink-body">
            {product.description}
          </p>
        ) : null}

        <Link
          href={`/productos/${product.id}`}
          className="mt-3 inline-block font-display text-xs font-semibold text-brand-600 underline underline-offset-2"
        >
          Ver la ficha completa
        </Link>

        {product.variants.length > 0 ? (
          <div className="mt-4">
            <VariantPicker product={product} />
          </div>
        ) : (
          <ProductActions product={product} />
        )}
      </div>
    </div>
  );
};

const Esqueleto = () => (
  <div className="flex flex-col gap-5 p-5 md:flex-row md:p-6">
    <div className="aspect-square w-full shrink-0 animate-pulse rounded-card bg-surface md:w-60" />
    <div className="flex flex-1 flex-col gap-3">
      <div className="h-5 w-2/3 animate-pulse rounded bg-surface" />
      <div className="h-8 w-1/3 animate-pulse rounded bg-surface" />
      <div className="h-20 w-full animate-pulse rounded bg-surface" />
    </div>
  </div>
);

export const QuickView = ({ children }: { children: ReactNode }) => {
  const [product, setProduct] = useState<StoreProduct | null>(null);
  const [abierto, setAbierto] = useState(false);
  const [cargando, startTransition] = useTransition();

  const interceptar = (event: MouseEvent<HTMLDivElement>) => {
    const destino = (event.target as HTMLElement).closest("a");
    const id = idDelHref(destino?.getAttribute("href") ?? null);

    // Ctrl/Cmd o botón del medio: que abra la pestaña nueva como siempre.
    if (!id || event.metaKey || event.ctrlKey || event.button !== 0) return;

    event.preventDefault();
    event.stopPropagation();
    setProduct(null);
    setAbierto(true);

    startTransition(async () => {
      setProduct(await quickViewAction(id));
    });
  };

  const cerrar = () => {
    setAbierto(false);
    setProduct(null);
  };

  return (
    <>
      <div data-quickview onClickCapture={interceptar}>
        {children}
      </div>

      {abierto ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Detalle del producto"
          className="fixed inset-0 z-[120] flex items-end justify-center bg-ink/40 backdrop-blur-[2px] md:items-center md:p-6"
          onClick={(event) => {
            if (event.target === event.currentTarget) cerrar();
          }}
        >
          <div className="max-h-[88dvh] w-full max-w-[760px] overflow-y-auto rounded-t-card bg-white shadow-float md:rounded-card">
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <span className="font-display text-xs font-semibold uppercase tracking-wide text-ink-soft">
                Detalle del producto
              </span>
              <button
                type="button"
                onClick={cerrar}
                aria-label="Cerrar"
                className="grid h-8 w-8 place-items-center rounded-full text-lg leading-none text-ink-soft transition-colors hover:bg-surface hover:text-ink"
              >
                ×
              </button>
            </div>

            {cargando || !product ? <Esqueleto /> : <Ficha product={product} />}
          </div>
        </div>
      ) : null}
    </>
  );
};
