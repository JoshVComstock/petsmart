"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { IconSearch } from "@/components/ui/icons";
import { buildCatalogHref, type CatalogParams } from "@/lib/catalog";

/**
 * Lupa del catálogo. A diferencia del buscador del header, se queda en la
 * página donde está (el pedido de la cuenta, por ejemplo) y conserva los
 * filtros que ya estaban puestos.
 */

interface Props {
  params:    CatalogParams;
  base?:     string;
  className?: string;
}

export const CatalogSearchBox = ({ params, base, className = "" }: Props) => {
  const router = useRouter();

  const buscar = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const texto = String(new FormData(event.currentTarget).get("search") ?? "").trim();
    router.push(buildCatalogHref(params, { search: texto || undefined, page: undefined }, base));
  };

  return (
    <form
      onSubmit={buscar}
      role="search"
      className={`flex h-10 items-center gap-2 rounded-[20px] bg-surface pl-4 pr-[5px] ${className}`}
    >
      <input
        name="search"
        type="search"
        defaultValue={params.search ?? ""}
        aria-label="Buscar productos"
        placeholder="Buscar producto, marca…"
        className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft"
      />
      <button
        type="submit"
        aria-label="Buscar"
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-white transition-colors hover:bg-brand-500"
      >
        <IconSearch className="h-5 w-5" />
      </button>
    </form>
  );
};
