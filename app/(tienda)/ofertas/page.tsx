import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getCatalog } from "@/lib/api";

export const metadata: Metadata = { title: "Ofertas" };

const OffersPage = async () => {
  const offers = (await getCatalog({ onlyOffers: true, perPage: 60 })).items;

  return (
    <>
      <PageHero
        eyebrow="Precios rebajados"
        title="Ofertas de la semana"
        subtitle="Las rebajas que están publicadas ahora. Stock limitado."
      />

      <div className="bg-white px-4 py-12 md:px-8 md:py-[60px] lg:px-[72px]">
        <div className="mx-auto max-w-[1296px]">
          <ProductGrid
            products={offers}
            emptyTitle="Por ahora no hay ofertas"
            emptyMessage="Cuando publiquemos una rebaja la vas a ver acá."
          />
        </div>
      </div>
    </>
  );
};

export default OffersPage;
