"use client";

import { useRouter } from "next/navigation";
import type { ChangeEvent } from "react";
import { IconChevronDown } from "@/components/ui/icons";
import { SORT_OPTIONS, buildCatalogHref, type CatalogParams } from "@/lib/catalog";

/**
 * Selector de orden. Al cambiar navega con el parámetro nuevo: el
 * servidor devuelve la lista ya ordenada y no hace falta estado local.
 */

export const SortSelect = ({ params }: { params: CatalogParams }) => {
  const router = useRouter();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    router.push(buildCatalogHref(params, { sort: event.target.value, page: undefined }));
  };

  return (
    <label className="relative flex h-10 shrink-0 items-center rounded-[20px] border border-line bg-white pl-4 pr-9">
      <span className="sr-only">Ordenar productos</span>
      <select
        value={params.sort ?? "recientes"}
        onChange={handleChange}
        className="cursor-pointer appearance-none bg-transparent text-sm text-ink outline-none"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <IconChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-ink-soft" />
    </label>
  );
};
