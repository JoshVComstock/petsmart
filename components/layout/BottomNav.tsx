"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactElement } from "react";
import { IconCart, IconGrid, IconHome, IconMapPin, IconTag } from "@/components/ui/icons";
import { useCart } from "@/lib/use-cart";

/** Nav inferior tipo app móvil, con el carrito flotante al centro. */

const LINKS = [
  { href: "/", label: "Inicio", Icon: IconHome },
  { href: "/productos", label: "Productos", Icon: IconGrid },
  { href: "/ofertas", label: "Ofertas", Icon: IconTag },
  { href: "/sucursales", label: "Tiendas", Icon: IconMapPin },
] as const;

interface ItemProps {
  href: string;
  label: string;
  Icon: (props: { className?: string }) => ReactElement;
  active: boolean;
}

const NavItem = ({ href, label, Icon, active }: ItemProps) => (
  <Link
    href={href}
    aria-current={active ? "page" : undefined}
    className={`flex flex-col items-center gap-1 py-1 font-display text-[10px] font-semibold transition-colors ${
      active ? "text-brand-500" : "text-ink-soft"
    }`}
  >
    <Icon className="h-[22px] w-[22px]" />
    {label}
  </Link>
);

export const BottomNav = () => {
  const pathname = usePathname();
  const { items } = useCart();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 backdrop-blur-md md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-5 items-end px-2 pb-2 pt-2">
        {LINKS.slice(0, 2).map((link) => (
          <NavItem key={link.href} {...link} active={isActive(link.href)} />
        ))}

        {/* Carrito flotante central */}
        <div className="flex justify-center">
          <Link
            href="/carrito"
            aria-label={`Carrito con ${items} artículos`}
            className="relative -mt-7 grid h-14 w-14 place-items-center rounded-[18px] bg-ink text-white transition-transform active:scale-95"
          >
            <IconCart className="h-6 w-6" />
            {items > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full border-2 border-white bg-brand-500 px-1 text-[11px] font-bold text-white">
                {items}
              </span>
            ) : null}
          </Link>
        </div>

        {LINKS.slice(2).map((link) => (
          <NavItem key={link.href} {...link} active={isActive(link.href)} />
        ))}
      </div>
    </nav>
  );
};
