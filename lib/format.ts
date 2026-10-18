import { STORE } from "./config";
import type { Medible } from "./types";

/** 34.5 → "Bs 34.50" */
export const formatPrice = (value: number): string =>
  `${STORE.currency} ${value.toFixed(2)}`;

/** "1.5 kg" a partir de measure + unitOfMeasure */
export const formatMeasure = (product: Medible): string | null => {
  if (!product.measure) return null;
  return `${product.measure}${product.unitOfMeasure ? ` ${product.unitOfMeasure}` : ""}`;
};

/** Recorta descripciones largas para las tarjetas */
export const truncate = (text: string, max = 90): string => {
  const clean = text.trim();
  return clean.length <= max ? clean : `${clean.slice(0, max).trimEnd()}…`;
};

/** Etiqueta de disponibilidad según el stock total */
export const stockLabel = (stock: number): { text: string; tone: "ok" | "low" | "out" } => {
  if (stock <= 0) return { text: "Sin stock", tone: "out" };
  if (stock <= 5) return { text: `Últimas ${stock}`, tone: "low" };
  return { text: "Disponible", tone: "ok" };
};
