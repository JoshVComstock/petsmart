import type { Product } from "./types";

/**
 * Carrito con un store externo + useSyncExternalStore.
 * Elegido a propósito para NO usar useEffect: React se suscribe al store,
 * el snapshot del servidor es un carrito vacío (SSR seguro) y la
 * persistencia en localStorage ocurre dentro de las acciones.
 */

export interface CartLine {
  productId: number;
  name: string;
  photo: string | null;
  price: number;
  quantity: number;
  /** Sucursal de la que sale el producto */
  branchId: number | null;
  branchName: string | null;
  maxStock: number;
}

const STORAGE_KEY = "petsmart-cart";

const EMPTY: CartLine[] = [];
const listeners = new Set<() => void>();

const read = (): CartLine[] => {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as CartLine[]) : EMPTY;
    return Array.isArray(parsed) ? parsed : EMPTY;
  } catch {
    return EMPTY;
  }
};

// Referencia estable: getSnapshot debe devolver siempre el mismo objeto
// mientras no haya cambios, o React entra en bucle de renders.
let state: CartLine[] = read();

const commit = (next: CartLine[]) => {
  state = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* modo privado o sin espacio: el carrito sigue en memoria */
    }
  }
  listeners.forEach((notify) => notify());
};

export const cartStore = {
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  getSnapshot: () => state,
  getServerSnapshot: () => EMPTY,

  add: (product: Product, quantity = 1, branchId?: number) => {
    const branch =
      product.branches.find((b) => b.id === branchId) ?? product.branches[0] ?? null;

    const existing = state.find(
      (l) => l.productId === product.id && l.branchId === (branch?.id ?? null)
    );

    if (existing) {
      cartStore.setQuantity(product.id, existing.quantity + quantity, branch?.id ?? null);
      return;
    }

    commit([
      ...state,
      {
        productId: product.id,
        name: product.name,
        photo: product.photo,
        price: product.price,
        quantity: Math.min(quantity, branch?.quantity ?? quantity),
        branchId: branch?.id ?? null,
        branchName: branch?.name ?? null,
        maxStock: branch?.quantity ?? product.stock,
      },
    ]);
  },

  setQuantity: (productId: number, quantity: number, branchId: number | null) => {
    if (quantity <= 0) {
      cartStore.remove(productId, branchId);
      return;
    }
    commit(
      state.map((l) =>
        l.productId === productId && l.branchId === branchId
          ? { ...l, quantity: Math.min(quantity, l.maxStock) }
          : l
      )
    );
  },

  remove: (productId: number, branchId: number | null) => {
    commit(state.filter((l) => !(l.productId === productId && l.branchId === branchId)));
  },

  clear: () => {
    commit(EMPTY);
  },
};

/** Totales derivados — se calculan, no se guardan */
export const cartTotals = (lines: CartLine[]) => {
  const items = lines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.quantity * l.price, 0);
  return { items, subtotal };
};
