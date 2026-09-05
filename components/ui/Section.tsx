import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Bloque de página del template: título de 40px en Poppins, 60px de
 * aire arriba y abajo, y el contenedor de 1296px centrado.
 * `align="center"` reproduce las secciones de productos; `align="left"`
 * las que llevan controles a la derecha (categorías, mascotas).
 */

interface Props {
  title?: string;
  subtitle?: string;
  /** Link "Ver todo" a la derecha del título */
  href?: string;
  linkLabel?: string;
  /** Controles propios a la derecha (por ejemplo las flechas del carrusel) */
  action?: ReactNode;
  align?: "left" | "center";
  children: ReactNode;
  className?: string;
}

export const Section = ({
  title,
  subtitle,
  href,
  linkLabel = "Ver todo",
  action,
  align = "left",
  children,
  className = "",
}: Props) => (
  <section className={`px-4 py-12 md:px-8 md:py-[60px] lg:px-[72px] ${className}`}>
    <div className="mx-auto max-w-[1296px]">
      {title ? (
        <header
          className={`mb-8 gap-4 md:mb-[60px] ${
            align === "center"
              ? "flex flex-col items-center text-center"
              : "flex items-end justify-between"
          }`}
        >
          <div>
            <h2 className="font-display text-[28px] font-semibold leading-tight text-ink md:text-[40px] md:leading-[48px]">
              {title}
            </h2>
            {subtitle ? <p className="mt-2 text-sm text-ink-soft md:text-base">{subtitle}</p> : null}
          </div>

          {action}

          {href && !action ? (
            <Link
              href={href}
              className="shrink-0 font-display text-sm font-semibold text-brand-500 transition-colors hover:text-brand-600 md:text-base"
            >
              {linkLabel} →
            </Link>
          ) : null}
        </header>
      ) : null}

      {children}
    </div>
  </section>
);
