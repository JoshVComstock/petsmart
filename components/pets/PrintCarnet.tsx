"use client";

import { IconPrinter } from "@/components/ui/icons";

/**
 * Imprime un solo carnet.
 *
 * Marca el carnet elegido y el body, y las reglas @media print de
 * globals.css esconden todo lo demás, incluidas las acciones de la tarjeta
 * (que llevan la clase .no-imprimir). Al cerrar el diálogo se limpia.
 */

export const imprimirCarnet = (petId: number) => {
  const tarjeta = document.querySelector(`[data-carnet="${petId}"]`);
  if (!tarjeta) return;

  tarjeta.classList.add("carnet-imprimible");
  document.body.classList.add("imprimiendo-carnet");

  const limpiar = () => {
    tarjeta.classList.remove("carnet-imprimible");
    document.body.classList.remove("imprimiendo-carnet");
    window.removeEventListener("afterprint", limpiar);
  };

  window.addEventListener("afterprint", limpiar);
  window.print();
};

export const PrintCarnetButton = ({ petId }: { petId: number }) => (
  <button
    type="button"
    onClick={() => imprimirCarnet(petId)}
    className="inline-flex items-center gap-1.5 font-display text-sm font-semibold text-ink transition-colors hover:text-brand-600"
  >
    <IconPrinter className="h-4 w-4" />
    Imprimir
  </button>
);
