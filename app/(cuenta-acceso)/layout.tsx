import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/layout/Logo";
import { IconArrowRight } from "@/components/ui/icons";

/**
 * Entrar, registrarse, recuperar y confirmar el correo.
 *
 * Van sin el nav ni el pie de la tienda a propósito: son pantallas de un solo
 * paso y cualquier otro link es una invitación a abandonarlas. Queda el logo
 * para volver y nada más.
 */
const AccesoLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-dvh flex-col bg-surface">
    <header className="flex items-center justify-between px-4 py-4 md:px-8">
      <Logo />

      <Link
        href="/"
        className="flex items-center gap-1.5 rounded-pill border border-line bg-white px-4 py-2 font-display text-sm font-semibold text-ink-body transition-colors hover:border-ink hover:text-ink"
      >
        Seguir comprando
        <IconArrowRight className="h-4 w-4" />
      </Link>
    </header>

    <main className="flex flex-1 items-center justify-center">{children}</main>

    <footer className="px-4 py-6 text-center text-xs text-ink-soft">
      <Link href="/terminos" className="transition-colors hover:text-brand-500">
        Términos y condiciones
      </Link>
    </footer>
  </div>
);

export default AccesoLayout;
