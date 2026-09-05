"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Logo } from "@/components/layout/Logo";
import {
  IconGrid,
  IconHeart,
  IconMapPin,
  IconPackage,
  IconUser,
  IconArrowRight,
} from "@/components/ui/icons";

const LINKS = [
  { href: "/cuenta", label: "Resumen", Icon: IconGrid },
  { href: "/cuenta/pedidos", label: "Mis pedidos", Icon: IconPackage },
  { href: "/cuenta/favoritos", label: "Favoritos", Icon: IconHeart },
  { href: "/cuenta/ubicaciones", label: "Ubicaciones", Icon: IconMapPin },
  { href: "/cuenta/perfil", label: "Mis datos", Icon: IconUser },
] as const;

interface Props {
  name: string;
  email: string | null;
  children: ReactNode;
  banner?: ReactNode;
  logout: ReactNode;
}

export const DashboardShell = ({ name, email, children, banner, logout }: Props) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const activeLabel = LINKS.find((link) => link.href === pathname)?.label ?? "Mi cuenta";

  const navLinks = (onNavigate?: () => void) =>
    LINKS.map(({ href, label, Icon }) => {
      const active = pathname === href;

      return (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          aria-current={active ? "page" : undefined}
          className={`flex items-center gap-3 rounded-btn px-4 py-2.5 font-display text-sm font-semibold transition-colors ${
            active ? "bg-ink text-white" : "text-ink-body hover:bg-surface-2"
          }`}
        >
          <Icon className="h-5 w-5 shrink-0" />
          {label}
        </Link>
      );
    });

  return (
    <div className="flex h-dvh overflow-hidden bg-surface">
      <aside className="hidden w-[264px] shrink-0 flex-col overflow-y-auto border-r border-line bg-white px-4 py-5 lg:flex">
        <Link href="/" className="mb-6 shrink-0 px-2">
          <Logo />
        </Link>

        <div className="mb-5 flex shrink-0 items-center gap-3 rounded-card bg-surface px-3 py-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-sm font-bold text-white">
            {name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold text-ink">{name}</p>
            {email ? <p className="truncate text-xs text-ink-soft">{email}</p> : null}
          </div>
        </div>

        <nav className="flex shrink-0 flex-col gap-1">{navLinks()}</nav>

        <div className="mt-4 flex shrink-0 flex-col gap-1 border-t border-line pt-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-btn px-4 py-2.5 font-display text-sm font-semibold text-ink-body transition-colors hover:bg-surface-2"
          >
            <IconArrowRight className="h-5 w-5 shrink-0" />
            Volver a la tienda
          </Link>
          {logout}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex shrink-0 items-center gap-3 border-b border-line bg-white px-4 py-3 md:px-6">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label="Abrir menú de la cuenta"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-btn border border-line text-ink lg:hidden"
          >
            <IconGrid className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-base font-semibold leading-tight text-ink md:text-lg">
              {activeLabel}
            </p>
            <p className="truncate text-xs text-ink-soft">Hola, {name.split(" ")[0]}</p>
          </div>

          <Link
            href="/"
            className="hidden shrink-0 rounded-btn bg-surface px-4 py-2 font-display text-sm font-semibold text-ink transition-colors hover:bg-surface-2 lg:inline-block"
          >
            Ir a la tienda
          </Link>
        </header>

        {open ? (
          <nav className="flex shrink-0 flex-col gap-1 border-b border-line bg-white px-4 py-3 lg:hidden">
            {navLinks(() => setOpen(false))}
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-btn px-4 py-2.5 font-display text-sm font-semibold text-ink-body"
            >
              <IconArrowRight className="h-5 w-5 shrink-0" />
              Volver a la tienda
            </Link>
            <div className="pt-1">{logout}</div>
          </nav>
        ) : null}

        <main className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-6 md:py-6">
          <div className="mx-auto max-w-[1100px]">
            {banner ? <div className="mb-5">{banner}</div> : null}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
