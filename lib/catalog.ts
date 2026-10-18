export type SortKey = "recientes" | "precio-asc" | "precio-desc" | "nombre";

/** Todos los parámetros que entiende /productos. Los resuelve el backend. */
export interface CatalogParams {
  search?: string;
  category?: string;
  branch?: string;
  brand?: string;
  sort?: string;
  page?: string;
}

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "recientes", label: "Más recientes" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
  { value: "nombre", label: "Nombre A–Z" },
];

const SORT_KEYS = SORT_OPTIONS.map((o) => o.value);

export const readSort = (value: string | undefined): SortKey =>
  SORT_KEYS.includes(value as SortKey) ? (value as SortKey) : "recientes";

export const readPage = (value: string | undefined): number => {
  const page = Number(value ?? 1);
  return Number.isInteger(page) && page >= 1 ? page : 1;
};

/** Arma un href del catálogo conservando los filtros actuales. */
export const buildCatalogHref = (
  current: CatalogParams,
  changes: Partial<CatalogParams> = {},
  base = "/productos"
): string => {
  const merged = { ...current, ...changes };
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(merged)) {
    if (value) params.set(key, value);
  }

  const query = params.toString();
  return query ? `${base}?${query}` : base;
};
