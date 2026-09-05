"use client";

import { useSyncExternalStore } from "react";
import { cartStore, cartTotals } from "./cart-store";

/**
 * Hook del carrito. Sin useEffect: React se suscribe al store externo
 * y en SSR recibe un carrito vacío, evitando errores de hidratación.
 */
export const useCart = () => {
  const lines = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot
  );

  return { lines, ...cartTotals(lines), ...cartStore };
};
