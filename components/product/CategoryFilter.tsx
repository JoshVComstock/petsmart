import Link from "next/link";
import type { Category } from "@/lib/types";
import { buildCatalogHref, type CatalogParams } from "@/lib/catalog";

interface Props {
  categories: Category[];
  params: CatalogParams;
  className?: string;
}

export const CategoryFilter = ({ categories, params, className = "" }: Props) => {
  const pill = (active: boolean) =>
    `shrink-0 rounded-full px-4 py-2 font-display text-xs font-semibold transition-colors ${
      active ? "bg-ink text-white" : "bg-white text-ink-soft ring-1 ring-line hover:ring-ink"
    }`;

  return (
    <div className={`no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0 ${className}`}>
      <Link
        href={buildCatalogHref(params, { category: undefined, page: undefined })}
        className={pill(!params.category)}
      >
        Todos
      </Link>

      {categories.map((category) => (
        <Link
          key={category.id}
          href={buildCatalogHref(params, { category: String(category.id), page: undefined })}
          className={pill(params.category === String(category.id))}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
};
