"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

/**
 * Avisos cortos arriba del contenido.
 *
 * El estado vive en un módulo y los componentes se suscriben con
 * useSyncExternalStore: cualquier parte de la tienda puede avisar algo sin
 * contextos ni efectos.
 */

export interface Aviso {
  id:       number;
  mensaje:  string;
  detalle?: string;
  href?:    string;
  hrefLabel?: string;
  tono:     "info" | "error";
}

const SEGUNDOS = 5000;

let avisos: Aviso[] = [];
let siguienteId = 1;
const oyentes = new Set<() => void>();

const avisar = () => {
  for (const oyente of oyentes) oyente();
};

const suscribir = (oyente: () => void) => {
  oyentes.add(oyente);
  return () => oyentes.delete(oyente);
};

const leer = () => avisos;

/** Constante: si devolviera un array nuevo, React entraría en bucle. */
const VACIO: Aviso[] = [];
const leerServidor = () => VACIO;

export const cerrarToast = (id: number) => {
  avisos = avisos.filter((aviso) => aviso.id !== id);
  avisar();
};

export const mostrarToast = (aviso: Omit<Aviso, "id" | "tono"> & { tono?: Aviso["tono"] }) => {
  const id = siguienteId++;
  avisos = [...avisos, { ...aviso, id, tono: aviso.tono ?? "info" }];
  avisar();
  setTimeout(() => cerrarToast(id), SEGUNDOS);
};

export const Toaster = () => {
  const lista = useSyncExternalStore(suscribir, leer, leerServidor);

  if (lista.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-[90] flex flex-col items-center gap-2 px-4 md:bottom-8"
    >
      {lista.map((aviso) => (
        <div
          key={aviso.id}
          className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-card border px-4 py-3 shadow-float ${
            aviso.tono === "error"
              ? "border-danger/20 bg-white"
              : "border-line bg-white"
          }`}
        >
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-semibold text-ink">{aviso.mensaje}</p>
            {aviso.detalle ? (
              <p className="mt-0.5 text-xs text-ink-soft">{aviso.detalle}</p>
            ) : null}
            {aviso.href ? (
              <Link
                href={aviso.href}
                onClick={() => cerrarToast(aviso.id)}
                className="mt-2 inline-block font-display text-xs font-semibold text-brand-600 underline underline-offset-2"
              >
                {aviso.hrefLabel ?? "Ir"}
              </Link>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => cerrarToast(aviso.id)}
            aria-label="Cerrar aviso"
            className="shrink-0 text-lg leading-none text-ink-faint transition-colors hover:text-ink"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};
