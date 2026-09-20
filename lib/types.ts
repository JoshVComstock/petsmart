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

export type GroomingTypeKey = "BASIC" | "PREMIUM" | "PLUS_PREMIUM";
export type SizeKey = "SMALL" | "MEDIUM" | "LARGE";

export interface GroomingPrice {
  serviceId: number;
  size: SizeKey;
  price: number;
}

export interface GroomingPackage {
  type: GroomingTypeKey;
  title: string;
  tagline: string | null;
  photo: string | null;
  sortOrder: number;
  description: string;
  fromPrice: number;
  prices: GroomingPrice[];
}

export interface GroomingExtra {
  id: number;
  name: string;
  price: number;
  description: string | null;
  photo: string | null;
}

export interface GroomingSchedule {
  openHour: number;
  closeHour: number;
  slotMinutes: number;
  workdays: number[];
  minHoursAhead: number;
  maxDaysAhead: number;
}

export interface GroomingCatalog {
  packages: GroomingPackage[];
  extras: GroomingExtra[];
  branch: Branch | null;
  schedule: GroomingSchedule;
}

export interface GroomingSlot {
  time: string;
  startsAt: string;
  available: boolean;
  reason: string | null;
}

export interface Availability {
  date: string;
  slots: GroomingSlot[];
  reason?: string;
}

export type PetSpecies =
  | "DOG" | "CAT" | "BIRD" | "FISH" | "RODENT" | "RABBIT" | "REPTILE" | "OTHER";

export interface Pet {
  id: number;
  name: string;
  breed: string | null;
  size: SizeKey | null;
  species: PetSpecies | null;
  sex: "MALE" | "FEMALE" | "UNKNOWN" | null;
  birthDate: string | null;
  weightKg: number | null;
  isNeutered: boolean | null;
  activity: "LOW" | "MODERATE" | "HIGH" | null;
  bodyCondition: "UNDERWEIGHT" | "IDEAL" | "OVERWEIGHT" | null;
  allergies: string | null;
  healthNotes: string | null;
  dietNotes: string | null;
  description: string | null;
  photo: string | null;
  ageMonths: number | null;
}

export interface Appointment {
  id: number;
  scheduledAt: string;
  status: "PENDING" | "CONFIRMED" | "DONE" | "CANCELLED" | "NO_SHOW";
  estimatedPrice: number | null;
  notes: string | null;
  durationMin: number;
  upcoming: boolean;
  pet: { id: number; name: string; breed: string | null; photo: string | null } | null;
  branch: { id: number; name: string; address: string; phone: string } | null;
  service: { id: number; type: GroomingTypeKey; size: SizeKey; price: string; description: string } | null;
  extras: { id: number; name: string; price: number }[];
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
