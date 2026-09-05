import Link from "next/link";
import Image from "next/image";
import { Blob } from "@/components/ui/Blob";
import { ScrollRail } from "@/components/ui/ScrollRail";
import { PET_TYPES } from "@/lib/config";

/**
 * "Comprá por mascota": las manchas con la silueta del template.
 * Cada una es un atajo a la búsqueda del catálogo (ver PET_TYPES en
 * lib/config para apuntarlas a lo que tengas cargado). La primera va en
 * naranja, igual que el diseño.
 */

export const PetRail = () => (
  <ScrollRail title="Comprá por mascota" className="bg-white">
    {PET_TYPES.map((pet, index) => (
      <Link
        key={pet.label}
        href={`/productos?search=${encodeURIComponent(pet.search)}`}
        className="group flex w-[128px] shrink-0 snap-start flex-col items-center gap-5 md:w-[190px] md:gap-[26px]"
      >
        <Blob
          variant={(index % 4) as 0 | 1 | 2 | 3}
          className="relative aspect-square w-full overflow-hidden bg-surface transition-transform duration-300 group-hover:scale-105"
        >
          <Image
            src={pet.image}
            alt={pet.label}
            fill
            sizes="(max-width: 768px) 128px, 190px"
            className="object-cover"
          />
        </Blob>

        <span className="font-display text-base font-semibold text-ink md:text-xl">
          {pet.label}
        </span>
      </Link>
    ))}
  </ScrollRail>
);
