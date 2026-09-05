import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getProducts } from "@/lib/api";

export const metadata: Metadata = { title: "Ofertas" };

const OffersPage = async () => {
  const offers = await getProducts({ onlyOffers: true });

  return (
    <>
      <PageHero
        eyebrow="Precios rebajados"
        title="Ofertas de la semana"
        subtitle="Productos que bajaron de precio respecto a su lote anterior. Stock limitado."
      />

      <div className="bg-white px-4 py-12 md:px-8 md:py-[60px] lg:px-[72px]">
        <div className="mx-auto max-w-[1296px]">
          <ProductGrid
            products={offers}
            emptyTitle="Por ahora no hay ofertas"
            emptyMessage="Volvé pronto: publicamos rebajas cada semana."
          />
        </div>
      </div>
    </>
  );
};

export default OffersPage;
