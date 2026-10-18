import Link from "next/link";
import { AddToCartButton } from "./AddToCartButton";
import { FavoriteButton } from "./FavoriteButton";
import { ProductImage } from "./ProductImage";
import { Price } from "@/components/ui/Price";
import { IconSliders } from "@/components/ui/icons";
import { formatMeasure, stockLabel } from "@/lib/format";
import { getSession } from "@/lib/session";
import { getFavoriteIds } from "@/lib/store-api";
import type { CatalogItem } from "@/lib/types";

/**
 * Tarjeta del catálogo, calcada del template: foto cuadrada sobre gris,
 * cuerpo blanco con nombre y precio, el corazón sobre la foto y el chip
 * redondo de agregar al carrito a la derecha.
 *
 * La sesión y los favoritos se piden acá adentro, pero ambos están cacheados
 * por render: veinte tarjetas siguen siendo una sola llamada de cada cosa.
 */

export const ProductCard = async ({ product }: { product: CatalogItem }) => {
  const measure = formatMeasure(product);
  const stock = stockLabel(product.stock);

  const [session, favoriteIds] = await Promise.all([getSession(), getFavoriteIds()]);

  return (
    <article className="group flex flex-col overflow-hidden rounded-card border border-surface bg-white transition-shadow duration-300 hover:shadow-[0_18px_40px_-28px_rgba(0,0,0,0.4)]">
      <div className="relative bg-surface">
        <Link href={`/productos/${product.id}`} className="block">
          <ProductImage
            src={product.photo}
            alt={product.name}
            className="aspect-square w-full transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </Link>

        {product.discount > 0 ? (
          <span className="absolute left-4 top-4 rounded-full bg-brand-500 px-3 py-1 font-display text-[11px] font-semibold leading-none text-white">
            −{product.discount}%
          </span>
        ) : null}

        <FavoriteButton
          productId={product.id}
          productName={product.name}
          isFavorite={favoriteIds.includes(product.id)}
          isLoggedIn={Boolean(session)}
          className="absolute right-3 top-3"
        />

        {stock.tone !== "ok" ? (
          <span
            className={`absolute bottom-4 left-4 rounded-full px-3 py-1 font-display text-[11px] font-semibold leading-none ${
              stock.tone === "out" ? "bg-ink/75 text-white" : "bg-white text-ink"
            }`}
          >
            {stock.text}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 items-start justify-between gap-2 p-3 md:gap-3 md:p-5">
        <div className="flex min-w-0 flex-col gap-2 md:gap-3">
          <Link href={`/productos/${product.id}`}>
            <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug text-ink transition-colors group-hover:text-brand-500 md:text-xl">
              {product.name}
            </h3>
          </Link>

          <div className="flex flex-wrap items-baseline gap-x-2">
            {product.priceFrom ? (
              <span className="text-sm text-ink-soft">desde</span>
            ) : null}
            <Price value={product.price} oldValue={product.oldPrice} />
            {measure ? <span className="text-sm text-ink-soft">· {measure}</span> : null}
          </div>

          {product.isSet ? (
            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-surface px-2.5 py-1 font-display text-[11px] font-semibold text-ink-soft">
              {product.variantCount} {product.variantCount === 1 ? "opción" : "opciones"}
            </span>
          ) : null}
        </div>

        {product.isSet ? (
          <Link
            href={`/productos/${product.id}`}
            aria-label={`Elegir opciones de ${product.name}`}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-white transition-colors hover:bg-brand-500 md:h-11 md:w-11"
          >
            <IconSliders className="h-5 w-5" />
          </Link>
        ) : (
          <AddToCartButton product={product} variant="icon" />
        )}
      </div>
    </article>
  );
};
