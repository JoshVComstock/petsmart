import Link from "next/link";
import { ProductImage } from "./ProductImage";
import { formatPrice } from "@/lib/format";
import { buildCatalogHref, type CatalogParams } from "@/lib/catalog";
import type { Branch, Category, Product } from "@/lib/types";

/**
 * Columna de filtros del template (306px). Cada opción es un link:
 * el estado vive en la URL, así el filtrado se resuelve en el servidor
 * y la vista es compartible por link.
 */

interface RowProps {
  href: string;
  label: string;
  count?: number;
  active: boolean;
}

const FilterRow = ({ href, label, count, active }: RowProps) => (
  <Link href={href} className="group flex items-center justify-between gap-3 py-1.5">
    <span className="flex min-w-0 items-center gap-3">
      {/* Cuadrito de check: es decorativo, el link es lo interactivo */}
      <span
        aria-hidden
        className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] border transition-colors ${
          active ? "border-brand-500 bg-brand-500" : "border-line group-hover:border-ink"
        }`}
      >
        {active ? (
          <svg viewBox="0 0 24 24" className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12.5 4.5 4.5L19 7" />
          </svg>
        ) : null}
      </span>
      <span
        className={`truncate text-sm transition-colors ${
          active ? "font-semibold text-ink" : "text-ink-body group-hover:text-ink"
        }`}
      >
        {label}
      </span>
    </span>

    {count !== undefined ? (
      <span className="shrink-0 text-xs font-semibold text-brand-500">{count}</span>
    ) : null}
  </Link>
);

const Group = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="border-b border-line pb-6 last:border-0 last:pb-0">
    <h3 className="mb-4 font-display text-lg font-semibold text-ink">{title}</h3>
    <div className="flex flex-col">{children}</div>
  </section>
);

interface Props {
  categories: Category[];
  brands: { name: string; count: number }[];
  branches: Branch[];
  popular: Product[];
  params: CatalogParams;
}

export const FilterSidebar = ({ categories, brands, branches, popular, params }: Props) => (
  <aside className="flex w-full shrink-0 flex-col gap-6 lg:w-[306px]">
    <Group title="Categorías">
      <FilterRow
        href={buildCatalogHref(params, { category: undefined, page: undefined })}
        label="Todas"
        active={!params.category}
      />
      {categories.map((category) => (
        <FilterRow
          key={category.id}
          href={buildCatalogHref(params, { category: String(category.id), page: undefined })}
          label={category.name}
          count={category.productCount}
          active={params.category === String(category.id)}
        />
      ))}
    </Group>

    {brands.length > 0 ? (
      <Group title="Marcas">
        <FilterRow
          href={buildCatalogHref(params, { brand: undefined, page: undefined })}
          label="Todas"
          active={!params.brand}
        />
        {brands.map((brand) => (
          <FilterRow
            key={brand.name}
            href={buildCatalogHref(params, { brand: brand.name, page: undefined })}
            label={brand.name}
            count={brand.count}
            active={params.brand === brand.name}
          />
        ))}
      </Group>
    ) : null}

    {branches.length > 0 ? (
      <Group title="Sucursal">
        <FilterRow
          href={buildCatalogHref(params, { branch: undefined, page: undefined })}
          label="Todas"
          active={!params.branch}
        />
        {branches.map((branch) => (
          <FilterRow
            key={branch.id}
            href={buildCatalogHref(params, { branch: String(branch.id), page: undefined })}
            label={branch.name}
            active={params.branch === String(branch.id)}
          />
        ))}
      </Group>
    ) : null}

    {popular.length > 0 ? (
      <Group title="Más pedidos">
        <ul className="flex flex-col gap-4 pt-1">
          {popular.map((product) => (
            <li key={product.id}>
              <Link href={`/productos/${product.id}`} className="group flex items-center gap-3">
                <ProductImage
                  src={product.photo}
                  alt={product.name}
                  className="h-14 w-14 shrink-0 rounded-[14px]"
                />
                <span className="min-w-0">
                  <span className="line-clamp-2 block font-display text-sm font-medium text-ink transition-colors group-hover:text-brand-500">
                    {product.name}
                  </span>
                  <span className="mt-0.5 block text-sm text-ink-soft">
                    {formatPrice(product.price)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Group>
    ) : null}
  </aside>
);
