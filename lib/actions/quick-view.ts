"use server";

import { getStoreProduct } from "@/lib/api";
import type { StoreProduct } from "@/lib/types";

/**
 * Ficha del producto para la vista rápida.
 *
 * Devuelve datos y no JSX a propósito: la ficha usa componentes de cliente
 * (variantes, agregar al carrito) que no están en el manifiesto de cliente
 * de la página del catálogo, y el bundler de RSC no los encuentra.
 */
export const quickViewAction = async (id: number): Promise<StoreProduct | null> =>
  getStoreProduct(id);
