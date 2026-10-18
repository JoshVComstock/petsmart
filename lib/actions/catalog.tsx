"use server";

import type { ReactNode } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { getCatalog } from "@/lib/api";
import type { CatalogQuery } from "@/lib/api";

/**
 * Trae una página más del catálogo para el botón "Ver más".
 *
 * Devuelve las tarjetas ya renderizadas, no los datos: la tarjeta es un
 * componente de servidor (lee la sesión y los favoritos) y así se puede
 * seguir usando tal cual desde el listado del navegador.
 */

export interface MasProductos {
  nodos:    ReactNode;
  cantidad: number;
  hasMore:  boolean;
}

export const loadMoreCatalogAction = async (
  query: CatalogQuery,
  page: number
): Promise<MasProductos> => {
  const pagina = await getCatalog({ ...query, page });

  return {
    nodos: (
      <>
        {pagina.items.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </>
    ),
    cantidad: pagina.items.length,
    hasMore:  pagina.hasMore,
  };
};
