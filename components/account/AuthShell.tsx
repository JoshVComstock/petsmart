import Link from "next/link";
import type { ReactNode } from "react";
import { Blob } from "@/components/ui/Blob";
import { PawPattern } from "@/components/ui/PawPattern";

/**
 * Marco de las pantallas de cuenta sin sesión (entrar, registrarse,
 * recuperar). Tarjeta blanca de 20px sobre el gris de la tienda, con las
 * manchas naranjas asomando, igual que el resto del sitio.
 */

interface Props {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export const AuthShell = ({ eyebrow, title, subtitle, children, footer }: Props) => (
  <div className="relative overflow-hidden bg-surface px-4 py-12 md:px-8 md:py-20">
    <div aria-hidden className="pointer-events-none absolute -left-32 -top-32 hidden h-[380px] w-[380px] md:block">
      <Blob variant={1} className="absolute inset-0 bg-brand-500/90" />
      <Blob variant={3} className="absolute inset-[20%] bg-brand-400" />
      <PawPattern className="text-white" />
    </div>
    <div aria-hidden className="pointer-events-none absolute -bottom-28 -right-24 hidden h-[320px] w-[320px] lg:block">
      <Blob variant={2} className="absolute inset-0 bg-brand-300" />
      <PawPattern className="text-white" />
    </div>

    <div className="relative mx-auto w-full max-w-[480px]">
      <div className="rounded-card border border-line bg-white p-6 md:p-10">
        <p className="font-display text-base font-bold capitalize text-brand-500">{eyebrow}</p>
        <h1 className="mt-3 font-display text-[28px] font-bold leading-tight text-ink md:text-[34px]">
          {title}
        </h1>
        {subtitle ? <p className="mt-3 text-base leading-relaxed text-ink-body">{subtitle}</p> : null}

        <div className="mt-8">{children}</div>
      </div>

      {footer ? <div className="mt-6 text-center text-base text-ink-body">{footer}</div> : null}

      <p className="mt-6 text-center text-sm text-ink-soft">
        <Link href="/productos" className="transition-colors hover:text-brand-500">
          Seguir comprando sin cuenta →
        </Link>
      </p>
    </div>
  </div>
);
