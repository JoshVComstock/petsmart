import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { PetRail } from "@/components/home/PetRail";
import { CategoryFilter } from "@/components/product/CategoryFilter";
import { FilterSidebar } from "@/components/product/FilterSidebar";
import { Pagination } from "@/components/product/Pagination";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SortSelect } from "@/components/product/SortSelect";
import { getBranches, getCategories, getProducts } from "@/lib/api";
import { collectBrands, paginateCatalog, type CatalogParams } from "@/lib/catalog";
import { PAGE_SIZE } from "@/lib/config";

export const metadata: Metadata = { title: "Productos" };

interface Props {
  searchParams: Promise<CatalogParams>;
}

const ProductsPage = async ({ searchParams }: Props) => {
  const params = await searchParams;

  // search / category / branch los resuelve el backend; marca, orden y
  // página se aplican después sobre esa misma respuesta.
  const [products, categories, branches] = await Promise.all([
    getProducts({ search: params.search, category: params.category, branch: params.branch }),
    getCategories(),
    getBranches(),
  ]);

  const brands = collectBrands(products);
  const { items, total, page, totalPages } = paginateCatalog(products, params);
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <>
      <PageHero
        eyebrow="Catálogo"
        title={params.search ? `Resultados para “${params.search}”` : "Todos los productos"}
        subtitle="Alimento, accesorios y bienestar para cada etapa de tu mascota."
      />

      <div className="bg-white">
        <PetRail />

        <div className="px-4 pb-16 md:px-8 lg:px-[72px]">
          <div className="mx-auto flex max-w-[1296px] flex-col gap-8 lg:flex-row lg:gap-10">
            {/* Filtros: columna en desktop */}
            <div className="hidden lg:block">
              <FilterSidebar
                categories={categories}
                brands={brands}
                branches={branches}
                popular={products.slice(0, 5)}
                params={params}
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-ink-soft">
                  Mostrando {from}–{to} de {total} {total === 1 ? "producto" : "productos"}
                </p>
                <SortSelect params={params} />
              </div>

              {/* En mobile los filtros se reducen a las píldoras de categoría */}
              <CategoryFilter categories={categories} params={params} className="mb-6 lg:hidden" />

              <ProductGrid
                products={items}
                columns={3}
                emptyTitle={
                  params.search ? `Sin resultados para “${params.search}”` : "No hay productos"
                }
              />

              <Pagination page={page} totalPages={totalPages} params={params} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
