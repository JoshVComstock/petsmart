import { Hero } from "@/components/home/Hero";
import { CategoryRail } from "@/components/home/CategoryRail";
import { PetRail } from "@/components/home/PetRail";
import { InfoBlock } from "@/components/home/InfoBlock";
import { Benefits } from "@/components/home/Benefits";
import { Section } from "@/components/ui/Section";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getCatalog, getCategories } from "@/lib/api";

const HomePage = async () => {
  // Datos en paralelo, en el servidor: sin useEffect ni estados de carga.
  const [categories, featured, offers] = await Promise.all([
    getCategories(),
    getCatalog({ perPage: 8 }),
    getCatalog({ onlyOffers: true, perPage: 8 }),
  ]);

  return (
    <>
      <Hero products={featured.items} />

      <div className="bg-white">
        <CategoryRail categories={categories} />

        <Section
          title="Productos destacados"
          subtitle="Lo más elegido de nuestro catálogo"
          align="center"
          className="pt-0"
        >
          <ProductGrid products={featured.items} />
        </Section>
      </div>

      <InfoBlock />

      <div className="bg-white">
        <Section>
          <Benefits />
        </Section>

        {offers.items.length > 0 ? (
          <Section
            title="Ofertas de la semana"
            subtitle="Productos que bajaron de precio"
            align="center"
            className="pt-0"
          >
            <ProductGrid products={offers.items} />
          </Section>
        ) : null}

        <PetRail />
      </div>
    </>
  );
};

export default HomePage;
