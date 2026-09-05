"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/config";

/**
 * Menú de escritorio. El link activo va en naranja con subrayado de 2px,
 * tal cual el template. Es cliente solo por usePathname: no hay estado
 * propio ni efectos.
 */

export const MainNav = () => {
  const pathname = usePathname();

  // "/" solo coincide exacto; el resto también en sus subrutas.
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="hidden items-center gap-2 lg:flex xl:gap-6">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={isActive(link.href) ? "page" : undefined}
          className={`border-b-2 px-2.5 py-1 font-display text-lg transition-colors xl:text-xl ${
            isActive(link.href)
              ? "border-brand-500 font-semibold text-brand-500"
              : "border-transparent font-medium text-ink hover:text-brand-500"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};
