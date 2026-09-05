import { API_URL } from "./config";
import type { Branch, Category, Product, ProductFilters } from "./types";

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

export const getProduct = (id: string | number) =>
  request<Product | null>(`/products/${id}`, null);

export const getCategories = () => request<Category[]>("/categories", []);

export const getBranches = () => request<Branch[]>("/branches", []);
