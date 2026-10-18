import { API_URL } from "./config";
import type {
  Availability,
  Branch,
  BrandFacet,
  CatalogPage,
  Category,
  GroomingCatalog,
  Product,
  ProductFilters,
  StoreProduct,
} from "./types";

/**
 * Cliente del API público. Se usa desde Server Components,
 * por eso no hace falta ningún useEffect para traer datos.
 */

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

const request = async <T>(path: string, fallback: T): Promise<T> => {
  try {
    const res = await fetch(`${API_URL}/ecommerce${path}`, {
      // El catálogo cambia poco: cache corto para que la tienda vuele.
      next: { revalidate: 60 },
    });
    if (!res.ok) return fallback;
    const json = (await res.json()) as ApiResponse<T>;
    return json.data ?? fallback;
  } catch {
    // Si el backend está caído la tienda sigue en pie, solo sin datos.
    return fallback;
  }
};

const buildQuery = (filters: ProductFilters = {}): string => {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.category) params.set("category", filters.category);
  if (filters.branch) params.set("branch", filters.branch);
  if (filters.onlyOffers) params.set("onlyOffers", "true");
  const qs = params.toString();
  return qs ? `?${qs}` : "";
};

export const getProducts = (filters?: ProductFilters) =>
  request<Product[]>(`/products${buildQuery(filters)}`, []);

export interface CatalogQuery {
  search?: string;
  category?: string;
  branch?: string;
  brand?: string;
  sort?: string;
  page?: number;
  perPage?: number;
  onlyOffers?: boolean;
}

const catalogQuery = (q: CatalogQuery = {}): string => {
  const params = new URLSearchParams();
  if (q.search) params.set("search", q.search);
  if (q.category) params.set("category", q.category);
  if (q.branch) params.set("branch", q.branch);
  if (q.brand) params.set("brand", q.brand);
  if (q.sort) params.set("sort", q.sort);
  if (q.page) params.set("page", String(q.page));
  if (q.perPage) params.set("perPage", String(q.perPage));
  if (q.onlyOffers) params.set("onlyOffers", "true");

  const qs = params.toString();
  return qs ? `?${qs}` : "";
};

const PAGINA_VACIA: CatalogPage = {
  items: [], page: 1, perPage: 0, total: 0, totalPages: 1, hasMore: false,
};

export const getCatalog = (query?: CatalogQuery) =>
  request<CatalogPage>(`/catalog${catalogQuery(query)}`, PAGINA_VACIA);

export const searchCatalog = (query: CatalogQuery) =>
  request<CatalogPage>(`/catalog/search${catalogQuery(query)}`, PAGINA_VACIA);

export const getCatalogBrands = (query?: CatalogQuery) =>
  request<BrandFacet[]>(`/catalog/brands${catalogQuery(query)}`, []);

export const getStoreProduct = (id: string | number) =>
  request<StoreProduct | null>(`/catalog/${id}`, null);

export const getProduct = (id: string | number) =>
  request<Product | null>(`/products/${id}`, null);

export const getCategories = () => request<Category[]>("/categories", []);

export const getBranches = () => request<Branch[]>("/branches", []);

const CATALOGO_VACIO: GroomingCatalog = {
  packages: [],
  extras: [],
  branch: null,
  schedule: {
    openHour: 9, closeHour: 16, slotMinutes: 60,
    workdays: [1, 2, 3, 4, 5], minHoursAhead: 5, maxDaysAhead: 30,
  },
};

export const getGroomingCatalog = (): Promise<GroomingCatalog> =>
  request<GroomingCatalog>("/grooming/services", CATALOGO_VACIO);

export const getAvailability = (date: string): Promise<Availability> =>
  request<Availability>(`/grooming/availability?date=${date}`, { date, slots: [] });
