import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountCheckout } from "@/components/account/AccountCheckout";
import { CartLines } from "@/components/cart/CartLines";
import { CatalogList } from "@/components/product/CatalogList";
import { CatalogSearchBox } from "@/components/product/CatalogSearchBox";
import { CategoryFilter } from "@/components/product/CategoryFilter";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickView } from "@/components/product/QuickView";
import { SortSelect } from "@/components/product/SortSelect";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconArrowRight } from "@/components/ui/icons";
import { getBranches, getCatalog, getCategories } from "@/lib/api";
import { readSort, type CatalogParams } from "@/lib/catalog";
import { PAGE_SIZE } from "@/lib/config";
import { getSession } from "@/lib/session";
import { apiGet } from "@/lib/store-api";
import type { Address } from "@/lib/types";

export const metadata: Metadata = { title: "Nuevo pedido" };

const BASE = "/cuenta/pedidos/nuevo";

/**
 * Pedido completo sin salir de la cuenta: el catálogo con su buscador a la
 * izquierda y el carrito al costado. Tocar un producto abre su ficha encima,
 * no lleva a otra página, y el pedido se confirma con el sistema.
 */
const NuevoPedidoPage = async ({
  searchParams,
}: {
  searchParams: Promise<CatalogParams>;
}) => {
  const params = await searchParams;
  const client = await getSession();

  if (!client) redirect(`/ingresar?volver=${encodeURIComponent(BASE)}`);

  const consulta = {
    search:   params.search,
    category: params.category,
    brand:    params.brand,
    branch:   params.branch,
    sort:     readSort(params.sort),
    page:     1,
    perPage:  PAGE_SIZE,
  };

  const [catalogo, categories, branches, direcciones] = await Promise.all([
    getCatalog(consulta),
    getCategories(),
    getBranches(),
    apiGet<Address[]>("/account/addresses"),
  ]);

  const { items, total } = catalogo;

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/cuenta/pedidos"
        className="inline-flex w-fit items-center gap-2 font-display text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
      >
        <IconArrowRight className="h-4 w-4 rotate-180" />
        Volver a mis pedidos
      </Link>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <section className="min-w-0 rounded-card border border-line bg-white p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="font-display text-lg font-semibold text-ink">Elegí los productos</h2>
              <p className="text-xs text-ink-soft">
                {total} {total === 1 ? "disponible" : "disponibles"}
              </p>
            </div>

            <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto sm:flex-1 sm:flex-nowrap sm:justify-end">
              <CatalogSearchBox params={params} base={BASE} className="min-w-[200px] flex-1 sm:max-w-[260px]" />
              <SortSelect params={params} base={BASE} />
            </div>
          </div>

          <CategoryFilter categories={categories} params={params} base={BASE} className="mt-3" />

          <div className="mt-4">
            {total === 0 ? (
              <EmptyState
                title={
                  params.search ? `Sin resultados para “${params.search}”` : "No hay productos"
                }
                message="Probá con otra búsqueda o mirá todo el catálogo."
                actionHref={BASE}
                actionLabel="Ver todo"
              />
            ) : (
              <QuickView>
                <CatalogList
                  query={consulta}
                  total={total}
                  mostrados={items.length}
                  hasMore={catalogo.hasMore}
                  altura="caja-productos-panel"
                  grilla="grid-cols-2 gap-3 md:grid-cols-3 2xl:grid-cols-4"
                >
                  {items.map((item) => (
                    <ProductCard key={item.id} product={item} />
                  ))}
                </CatalogList>
              </QuickView>
            )}
          </div>
        </section>

        <aside className="flex min-w-0 flex-col gap-4 xl:sticky xl:top-2">
          <CartLines />
          <AccountCheckout
            branches={branches}
            client={client}
            addresses={direcciones.data ?? []}
          />
        </aside>
      </div>
    </div>
  );
};

export default NuevoPedidoPage;
