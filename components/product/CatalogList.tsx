"use client";

import { useRef, useState, useTransition, type ReactNode } from "react";
import { loadMoreCatalogAction } from "@/lib/actions/catalog";
import type { CatalogQuery } from "@/lib/api";

/**
 * Catálogo que crece hacia abajo.
 *
 * La primera página llega renderizada del servidor como children; cada
 * "Ver más" suma la siguiente al final. En pantalla ancha la grilla tiene su
 * propio scroll, así los filtros de la izquierda se quedan quietos y agregar
 * productos no mueve la página de lugar. Cuando ya no hay más, el scroll
 * sigue de largo hasta el pie como siempre.
 */

interface Props {
  children:  ReactNode;
  query:     CatalogQuery;
  total:     number;
  mostrados: number;
  hasMore:   boolean;
  /** Alto de la caja con scroll propio. Por defecto, lo que queda de pantalla. */
  altura?:   string;
  /** Clases de la grilla: en el panel de la cuenta entran menos columnas. */
  grilla?:   string;
}

const ALTURA_POR_DEFECTO = "caja-productos";
const GRILLA_POR_DEFECTO = "grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4";

export const CatalogList = ({
  children, query, total, mostrados, hasMore,
  altura = ALTURA_POR_DEFECTO,
  grilla = GRILLA_POR_DEFECTO,
}: Props) => {
  const [paginas, setPaginas] = useState<ReactNode[]>([]);
  const [page, setPage]       = useState(1);
  const [visibles, setVisibles] = useState(mostrados);
  const [hayMas, setHayMas]   = useState(hasMore);
  const [cargando, startTransition] = useTransition();

  const cajaRef = useRef<HTMLDivElement>(null);

  const verMas = () => {
    // Dónde estaba parado, por si algo vuelve a dibujar el árbol de arriba.
    const dentro = cajaRef.current?.scrollTop ?? 0;
    const pagina = window.scrollY;

    startTransition(async () => {
      const siguiente = page + 1;
      const extra = await loadMoreCatalogAction(query, siguiente);

      setPaginas((previas) => [...previas, extra.nodos]);
      setVisibles((previos) => previos + extra.cantidad);
      setPage(siguiente);
      setHayMas(extra.hasMore);

      requestAnimationFrame(() => {
        if (cajaRef.current) cajaRef.current.scrollTop = dentro;
        if (window.scrollY !== pagina) window.scrollTo({ top: pagina });
      });
    });
  };

  return (
    <div ref={cajaRef} className={altura}>
      <div className={`grid ${grilla}`}>
        {children}
        {paginas}
      </div>

      {hayMas ? (
        <div className="mt-8 flex flex-col items-center gap-2 pb-2">
          <button
            type="button"
            onClick={verMas}
            disabled={cargando}
            className="rounded-pill bg-ink px-8 py-3 font-display text-sm font-semibold text-white transition-colors hover:bg-ink/85 disabled:opacity-50"
          >
            {cargando ? "Cargando…" : "Ver más productos"}
          </button>
          <p className="text-xs text-ink-soft">
            {visibles} de {total}
          </p>
        </div>
      ) : (
        <p className="mt-8 pb-2 text-center text-xs text-ink-soft">
          Eso es todo: {total} {total === 1 ? "producto" : "productos"}.
        </p>
      )}
    </div>
  );
};
