import { Hero } from "@/components/home/Hero";
import { CategoryRail } from "@/components/home/CategoryRail";
import { PetRail } from "@/components/home/PetRail";
import { InfoBlock } from "@/components/home/InfoBlock";
import { Benefits } from "@/components/home/Benefits";
import { Section } from "@/components/ui/Section";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getCategories, getProducts } from "@/lib/api";

const HomePage = async () => {
  // Datos en paralelo, en el servidor: sin useEffect ni estados de carga.
  const [categories, featured, offers] = await Promise.all([
    getCategories(),
    getProducts(),
    getProducts({ onlyOffers: true }),
  ]);

  return (
    <>
      <Hero products={featured} />

      <div className="bg-white">
        <CategoryRail categories={categories} />

        <Section
          title="Productos destacados"
          subtitle="Lo más elegido de nuestro catálogo"
          align="center"
          className="pt-0"
        >
          <ProductGrid products={featured.slice(0, 8)} />
        </Section>
      </div>

      <InfoBlock />

      <div className="bg-white">
        <Section>
          <Benefits />
        </Section>

        {offers.length > 0 ? (
          <Section
            title="Ofertas de la semana"
            subtitle="Productos que bajaron de precio"
            align="center"
            className="pt-0"
          >
            <ProductGrid products={offers.slice(0, 8)} />
          </Section>
        ) : null}

        <PetRail />
      </div>
    </>
  );
};

export default HomePage;
