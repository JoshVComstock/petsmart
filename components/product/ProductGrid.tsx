import { ProductCard } from "./ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Product } from "@/lib/types";

/** Grilla de productos. `columns` sigue las dos densidades del diseño. */

interface Props {
  products: Product[];
  /** 3 en el catálogo con sidebar, 4 en las secciones a todo el ancho */
  columns?: 3 | 4;
  emptyTitle?: string;
  emptyMessage?: string;
}

const COLUMNS = {
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
} as const;

export const ProductGrid = ({
  products,
  columns = 4,
  emptyTitle = "No encontramos productos",
  emptyMessage = "Probá con otra búsqueda o mirá todo el catálogo.",
}: Props) => {
  if (products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        message={emptyMessage}
        actionHref="/productos"
        actionLabel="Ver todo el catálogo"
      />
    );
  }

  return (
    <div className={`grid gap-4 md:gap-6 ${COLUMNS[columns]}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
