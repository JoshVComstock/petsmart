/** Tipos que devuelve el backend en /api/ecommerce */

export interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
}

export interface BranchStock extends Branch {
  quantity: number;
}

export interface Category {
  id: number;
  name: string;
  productCount: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  barcode: string | null;
  photo: string | null;
  unitOfMeasure: string | null;
  measure: number | null;
  category: { id: number; name: string } | null;
  brand: { id: number; name: string } | null;
  /** Precio vigente (lote FIFO). Nunca null en el listado. */
  price: number;
  /** Precio anterior si el producto bajó de precio */
  oldPrice: number | null;
  /** % de descuento respecto al precio anterior */
  discount: number;
  stock: number;
  branches: BranchStock[];
}

/** Filtros del catálogo */
export interface ProductFilters {
  search?: string;
  category?: string;
  branch?: string;
  onlyOffers?: boolean;
}

// ─── Cuenta de cliente ────────────────────────────────────────────────────────

/** Cliente logueado, tal como lo devuelve /ecommerce/auth/me */
export interface StoreClient {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  ci: string | null;
  emailVerified: boolean;
}

export interface Address {
  id: number;
  label: string;
  address: string;
  reference: string | null;
  mapsUrl: string | null;
  isDefault: boolean;
}

export type OrderStatus = "PENDING" | "CONFIRMED" | "READY" | "COMPLETED" | "CANCELLED";

export interface AccountOrderItem {
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

/** Un pedido en "Mis pedidos": puede venir de la web o del mostrador. */
export interface AccountOrder {
  key: string;
  code: string;
  source: "WEB" | "TIENDA";
  date: string;
  status: OrderStatus;
  total: number;
  method: "DELIVERY" | "PICKUP" | null;
  branch: { id: number; name: string } | null;
  items: AccountOrderItem[];
}
