import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { PetRail } from "@/components/home/PetRail";
import { CategoryFilter } from "@/components/product/CategoryFilter";
import { FilterSidebar } from "@/components/product/FilterSidebar";
import { CatalogList } from "@/components/product/CatalogList";
import { QuickView } from "@/components/product/QuickView";
import { ProductCard } from "@/components/product/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { SortSelect } from "@/components/product/SortSelect";
import {
  getBranches,
  getCatalog,
  getCatalogBrands,
  getCategories,
} from "@/lib/api";
import { readPage, readSort, type CatalogParams } from "@/lib/catalog";
import { PAGE_SIZE } from "@/lib/config";

export const metadata: Metadata = { title: "Productos" };

interface Props {
  searchParams: Promise<CatalogParams>;
}

const ProductsPage = async ({ searchParams }: Props) => {
  const params = await searchParams;

  // Todo lo resuelve el backend: solo viajan los productos de esta página.
  const consulta = {
    search: params.search,
    category: params.category,
    branch: params.branch,
    brand: params.brand,
    sort: readSort(params.sort),
    page: readPage(params.page),
    perPage: PAGE_SIZE,
  };

  const [catalogo, brands, categories, branches] = await Promise.all([
    getCatalog(consulta),
    getCatalogBrands(consulta),
    getCategories(),
    getBranches(),
  ]);

  const { items, total } = catalogo;

  return (
    <>
      <PageHero
        eyebrow="Catálogo"
        title={
          params.search
            ? `Resultados para “${params.search}”`
            : "Todos los productos"
        }
        subtitle="Alimento, accesorios y bienestar para cada etapa de tu mascota."
      />

      <div className="bg-white">
        <PetRail />

        <div className="px-4 pb-16 md:px-8 lg:px-[72px]">
          <div className="mx-auto flex max-w-[1296px] flex-col gap-8 lg:flex-row lg:gap-10">
            {/* Filtros: columna en desktop */}
            <div className="caja-filtros hidden lg:block">
              <FilterSidebar
                categories={categories}
                brands={brands}
                branches={branches}
                popular={items.slice(0, 5)}
                params={params}
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-ink-soft">
                  {total} {total === 1 ? "producto" : "productos"}
                </p>
                <SortSelect params={params} />
              </div>

              {/* En mobile los filtros se reducen a las píldoras de categoría */}
              <CategoryFilter
                categories={categories}
                params={params}
                className="mb-6 lg:hidden"
              />

              {total === 0 ? (
                <EmptyState
                  title={
                    params.search
                      ? `Sin resultados para “${params.search}”`
                      : "No hay productos"
                  }
                  message="Probá con otra búsqueda o mirá todo el catálogo."
                  actionHref="/productos"
                  actionLabel="Ver todo el catálogo"
                />
              ) : (
                <QuickView>
                  <CatalogList
                    query={consulta}
                    total={total}
                    mostrados={items.length}
                    hasMore={catalogo.hasMore}
                  >
                    {items.map((item) => (
                      <ProductCard key={item.id} product={item} />
                    ))}
                  </CatalogList>
                </QuickView>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
