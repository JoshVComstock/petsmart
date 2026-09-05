import Link from "next/link";
import Image from "next/image";
import { ScrollRail } from "@/components/ui/ScrollRail";
import { IconArrowRight, IconPaw } from "@/components/ui/icons";
import { categoryImage } from "@/lib/config";
import type { Category } from "@/lib/types";

/**
 * "Comprá por categoría": tarjetas de 306px con la foto arriba y el pie
 * gris con nombre, cantidad y la flecha naranja del template.
 * El backend no manda imagen de categoría, así que el tope va con un
 * degradado de marca y la huella.
 */

// Cuatro tonos que rotan para que la fila no quede plana.
const TONES = [
  "from-brand-100 to-brand-200",
  "from-surface-2 to-surface",
  "from-brand-50 to-brand-100",
  "from-surface to-surface-2",
] as const;

export const CategoryRail = ({ categories }: { categories: Category[] }) => {
  if (categories.length === 0) return null;

  return (
    <ScrollRail title="Comprá por categoría" href="/productos">
      {categories.map((category, index) => {
        const img = categoryImage(category.name);
        return (
        <Link
          key={category.id}
          href={`/productos?category=${category.id}`}
          className="group w-[240px] shrink-0 snap-start overflow-hidden rounded-card md:w-[306px]"
        >
          <div
            className={`relative h-[160px] overflow-hidden md:h-[216px] ${
              img ? "bg-surface" : `grid place-items-center bg-gradient-to-br text-brand-400 ${TONES[index % TONES.length]}`
            }`}
          >
            {img ? (
              <Image
                src={img}
                alt={category.name}
                fill
                sizes="(max-width: 768px) 240px, 306px"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <IconPaw className="h-16 w-16 transition-transform duration-500 group-hover:scale-110" />
            )}
          </div>

          <div className="flex items-start justify-between gap-3 bg-surface px-4 py-5">
            <span className="min-w-0">
              <span className="block truncate font-display text-base font-semibold text-ink md:text-xl">
                {category.name}
              </span>
              <span className="mt-2 block text-sm text-ink-soft md:text-base">
                {category.productCount} productos
              </span>
            </span>

            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-brand-500 transition-transform group-hover:translate-x-1">
              <IconArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>
        );
      })}
    </ScrollRail>
  );
};
