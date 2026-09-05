import type { Product } from "./types";
import { PAGE_SIZE } from "./config";

/**
 * Reglas del catálogo que viven en el front.
 *
 * El API expone search / category / branch / onlyOffers y devuelve la
 * lista completa. Marca, orden y paginación se resuelven acá sobre esa
 * misma respuesta: no se toca ningún endpoint.
 */

export type SortKey = "recientes" | "precio-asc" | "precio-desc" | "nombre";

/** Todos los parámetros que entiende /productos */
export interface CatalogParams {
  /** Va al API */
  search?: string;
  /** Va al API */
  category?: string;
  /** Va al API — es la sucursal */
  branch?: string;
  /** Se resuelve en el front */
  brand?: string;
  /** Se resuelve en el front */
  sort?: string;
  /** Se resuelve en el front */
  page?: string;
}

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "recientes", label: "Más recientes" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
  { value: "nombre", label: "Nombre A–Z" },
];

/** Arma un href de /productos conservando los filtros actuales. */
export const buildCatalogHref = (
  current: CatalogParams,
  changes: Partial<CatalogParams> = {}
): string => {
  const merged = { ...current, ...changes };
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(merged)) {
    if (value) params.set(key, value);
  }

  const query = params.toString();
  return query ? `/productos?${query}` : "/productos";
};

/** Marcas presentes en el resultado, con cuántos productos tiene cada una. */
export const collectBrands = (products: Product[]) => {
  const counts = new Map<string, number>();

  for (const product of products) {
    const name = product.brand?.name;
    if (name) counts.set(name, (counts.get(name) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
};

const SORTERS: Record<SortKey, (a: Product, b: Product) => number> = {
  recientes: (a, b) => b.id - a.id,
  "precio-asc": (a, b) => a.price - b.price,
  "precio-desc": (a, b) => b.price - a.price,
  nombre: (a, b) => a.name.localeCompare(b.name, "es"),
};

const isSortKey = (value: string | undefined): value is SortKey =>
  value !== undefined && value in SORTERS;

/**
 * Aplica marca + orden + paginación y devuelve lo que la página necesita
 * para pintarse: la porción visible y cuántas páginas hay en total.
 */
export const paginateCatalog = (products: Product[], params: CatalogParams) => {
  const filtered = params.brand
    ? products.filter((product) => product.brand?.name === params.brand)
    : products;

  const sortKey: SortKey = isSortKey(params.sort) ? params.sort : "recientes";
  const sorted = [...filtered].sort(SORTERS[sortKey]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  // Una página fuera de rango cae a la primera en vez de mostrar vacío.
  const requested = Number(params.page ?? 1);
  const page = Number.isInteger(requested) && requested >= 1 && requested <= totalPages ? requested : 1;

  return {
    items: sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    total: sorted.length,
    page,
    totalPages,
    sortKey,
  };
};
