"use client";

import Link from "next/link";
import { useRef } from "react";
import type { ReactNode } from "react";
import { IconChevronLeft, IconChevronRight } from "@/components/ui/icons";

/**
 * Sección con carrusel horizontal y las flechas negras del template.
 * Es cliente solo para poder llamar a scrollBy sobre la pista; no hay
 * estado ni efectos, la posición la maneja el propio scroll del navegador.
 */

interface Props {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  children: ReactNode;
  className?: string;
}

export const ScrollRail = ({
  title,
  subtitle,
  href,
  linkLabel = "Ver todo",
  children,
  className = "",
}: Props) => {
  const track = useRef<HTMLDivElement>(null);

  // Un “paso” es el ancho visible menos un poco, para que quede a la
  // vista la tarjeta que viene y se entienda que hay más contenido.
  const scrollStep = (direction: 1 | -1) => {
    const node = track.current;
    if (!node) return;
    node.scrollBy({ left: direction * (node.clientWidth * 0.8), behavior: "smooth" });
  };

  const arrow =
    "grid h-10 w-10 place-items-center rounded-full bg-ink text-white transition-colors hover:bg-brand-500";

  return (
    <section className={`px-4 py-12 md:px-8 md:py-[60px] lg:px-[72px] ${className}`}>
      <div className="mx-auto max-w-[1296px]">
        <header className="mb-8 flex items-end justify-between gap-4 md:mb-[60px]">
          <div>
            <h2 className="font-display text-[28px] font-semibold leading-tight text-ink md:text-[40px] md:leading-[48px]">
              {title}
            </h2>
            {subtitle ? <p className="mt-2 text-sm text-ink-soft md:text-base">{subtitle}</p> : null}
          </div>

          <div className="flex shrink-0 items-center gap-3 md:gap-6">
            {href ? (
              <Link
                href={href}
                className="hidden font-display text-base font-semibold text-brand-500 transition-colors hover:text-brand-600 md:block"
              >
                {linkLabel}
              </Link>
            ) : null}

            <button type="button" onClick={() => scrollStep(-1)} aria-label="Anterior" className={arrow}>
              <IconChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => scrollStep(1)} aria-label="Siguiente" className={arrow}>
              <IconChevronRight className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div
          ref={track}
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 md:mx-0 md:gap-6 md:px-0"
        >
          {children}
        </div>
      </div>
    </section>
  );
};
