import { Blob } from "@/components/ui/Blob";
import { Button } from "@/components/ui/Button";
import { PawPattern } from "@/components/ui/PawPattern";
import { ProductImage } from "@/components/product/ProductImage";
import { STORE } from "@/lib/config";
import type { Product } from "@/lib/types";

/**
 * Portada del template: texto a la izquierda y, a la derecha, las manchas
 * naranjas con huellas. En vez de la foto de stock del diseño se apoyan
 * ahí los productos destacados que ya trae el backend.
 */

// Dónde cae cada foto sobre la mancha. Tres posiciones fijas.
const SPOTS = [
  "left-[6%] top-[16%] w-[38%]",
  "right-[8%] top-[8%] w-[30%]",
  "bottom-[10%] left-[32%] w-[34%]",
] as const;

export const Hero = ({ products = [] }: { products?: Product[] }) => (
  <section className="relative overflow-hidden bg-surface px-4 md:px-8 lg:px-[72px]">
    <div className="mx-auto grid max-w-[1296px] items-center gap-10 py-10 md:py-14 lg:grid-cols-2 lg:gap-16 lg:py-20">
      {/* Texto */}
      <div className="relative z-10 flex flex-col items-start gap-5 md:gap-[45px]">
        <div className="flex flex-col gap-4 md:gap-5">
          <p className="font-display text-base font-bold capitalize text-brand-500">
            {STORE.name}
          </p>
          <h1 className="max-w-[647px] font-display text-[34px] font-bold leading-[1.12] text-ink md:text-[54px]">
            Todo lo que tu mascota necesita, en un solo lugar
          </h1>
          <p className="max-w-[479px] text-base leading-relaxed text-ink-body">
            {STORE.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 md:gap-4">
          <Button href="/productos" size="lg">
            Ver productos
          </Button>
          <Button href="/ofertas" size="lg" variant="outline">
            Ofertas
          </Button>
        </div>
      </div>

      {/* Manchas + productos */}
      <div className="relative mx-auto aspect-square w-full max-w-[420px] lg:max-w-[520px]">
        <Blob variant={0} className="absolute inset-0 bg-brand-500" />
        <Blob variant={1} className="absolute inset-[11%] bg-brand-400" />
        <Blob variant={2} className="absolute inset-[24%] bg-brand-300" />
        <PawPattern className="text-white" />

        {products.slice(0, SPOTS.length).map((product, index) => (
          <div
            key={product.id}
            className={`absolute overflow-hidden rounded-[24px] bg-white shadow-[0_24px_50px_-30px_rgba(0,0,0,0.55)] ${SPOTS[index]}`}
          >
            <ProductImage
              src={product.photo}
              alt={product.name}
              className="aspect-square w-full"
            />
          </div>
        ))}
      </div>
    </div>
  </section>
);
