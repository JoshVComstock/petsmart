import Link from "next/link";
import { IconChevronLeft, IconChevronRight } from "@/components/ui/icons";
import { buildCatalogHref, type CatalogParams } from "@/lib/catalog";

/**
 * Paginado del catálogo: números a la izquierda y anterior/siguiente a
 * la derecha, como en el template. Son links, así cada página tiene URL.
 */

interface Props {
  page: number;
  totalPages: number;
  params: CatalogParams;
}

export const Pagination = ({ page, totalPages, params }: Props) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const hrefFor = (target: number) =>
    buildCatalogHref(params, { page: target === 1 ? undefined : String(target) });

  const arrow =
    "grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink transition-colors hover:border-ink";

  return (
    <nav className="mt-10 flex items-center justify-between gap-4" aria-label="Paginación">
      <div className="flex flex-wrap items-center gap-2">
        {pages.map((target) => (
          <Link
            key={target}
            href={hrefFor(target)}
            aria-current={target === page ? "page" : undefined}
            className={`grid h-10 min-w-10 place-items-center rounded-[10px] px-3 font-display text-sm font-semibold transition-colors ${
              target === page
                ? "bg-brand-500 text-white"
                : "border border-line bg-white text-ink hover:border-ink"
            }`}
          >
            {target}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {page > 1 ? (
          <Link href={hrefFor(page - 1)} aria-label="Página anterior" className={arrow}>
            <IconChevronLeft className="h-5 w-5" />
          </Link>
        ) : null}
        {page < totalPages ? (
          <Link href={hrefFor(page + 1)} aria-label="Página siguiente" className={arrow}>
            <IconChevronRight className="h-5 w-5" />
          </Link>
        ) : null}
      </div>
    </nav>
  );
};
