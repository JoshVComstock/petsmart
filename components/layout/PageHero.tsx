import { Blob } from "@/components/ui/Blob";
import { PawPattern } from "@/components/ui/PawPattern";

/**
 * Cabecera gris de las páginas internas, con las manchas naranjas
 * asomando a la derecha como en el template.
 */

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export const PageHero = ({ eyebrow, title, subtitle }: Props) => (
  <section className="relative overflow-hidden bg-surface px-4 py-10 md:px-8 md:py-16 lg:px-[72px]">
    {/* Decoración: se sale del marco a la derecha y no recibe clics */}
    <div aria-hidden className="pointer-events-none absolute -right-24 -top-28 hidden h-[420px] w-[420px] md:block">
      <Blob variant={1} className="absolute inset-0 bg-brand-500/90" />
      <Blob variant={3} className="absolute inset-[18%] bg-brand-400" />
      <PawPattern className="text-white" />
    </div>

    <div className="relative mx-auto max-w-[1296px]">
      {eyebrow ? (
        <p className="font-display text-base font-bold capitalize text-brand-500">{eyebrow}</p>
      ) : null}

      <h1 className="mt-3 max-w-[647px] font-display text-[30px] font-bold leading-[1.14] text-ink md:text-[48px]">
        {title}
      </h1>

      {subtitle ? (
        <p className="mt-4 max-w-[479px] text-base leading-relaxed text-ink-body">{subtitle}</p>
      ) : null}
    </div>
  </section>
);
