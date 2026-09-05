import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Price } from "@/components/ui/Price";
import { Section } from "@/components/ui/Section";
import { ProductImage } from "@/components/product/ProductImage";
import { ProductActions } from "@/components/product/ProductActions";
import { ProductGrid } from "@/components/product/ProductGrid";
import { IconStore, IconTruck } from "@/components/ui/icons";
import { getProduct, getProducts } from "@/lib/api";
import { formatMeasure, stockLabel } from "@/lib/format";

interface Props {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { id } = await params;
  const product = await getProduct(id);
  return { title: product?.name ?? "Producto" };
};

const ProductPage = async ({ params }: Props) => {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  const measure = formatMeasure(product);
  const stock = stockLabel(product.stock);
  const related = await getProducts({
    category: product.category?.id ? String(product.category.id) : undefined,
  });

  return (
    <div className="bg-white">
      <div className="px-4 py-8 md:px-8 md:py-12 lg:px-[72px]">
        <div className="mx-auto max-w-[1296px]">
          <nav className="mb-6 text-sm text-ink-soft">
            <Link href="/productos" className="transition-colors hover:text-brand-500">
              Productos
            </Link>
            {product.category ? (
              <>
                <span className="mx-2">/</span>
                <Link
                  href={`/productos?category=${product.category.id}`}
                  className="transition-colors hover:text-brand-500"
                >
                  {product.category.name}
                </Link>
              </>
            ) : null}
          </nav>

          <div className="grid gap-8 md:grid-cols-2 md:gap-14">
            {/* Imagen */}
            <div className="overflow-hidden rounded-card border border-surface bg-surface">
              <ProductImage src={product.photo} alt={product.name} className="aspect-square w-full" />
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                {product.category ? <Badge tone="neutral">{product.category.name}</Badge> : null}
                {product.discount > 0 ? <Badge tone="brand">−{product.discount}% OFF</Badge> : null}
                <Badge tone={stock.tone}>{stock.text}</Badge>
              </div>

              <h1 className="mt-5 font-display text-[28px] font-bold leading-tight text-ink md:text-[40px]">
                {product.name}
              </h1>

              {product.brand || measure ? (
                <p className="mt-2 text-base text-ink-soft">
                  {[product.brand?.name, measure].filter(Boolean).join(" · ")}
                </p>
              ) : null}

              <div className="mt-6">
                <Price value={product.price} oldValue={product.oldPrice} size="lg" />
              </div>

              {product.description ? (
                <p className="mt-5 text-base leading-relaxed text-ink-body">{product.description}</p>
              ) : null}

              {/* Disponibilidad por sucursal */}
              {product.branches.length > 0 ? (
                <div className="mt-8">
                  <h2 className="font-display text-base font-semibold text-ink">Disponible en</h2>
                  <ul className="mt-4 flex flex-col gap-2">
                    {product.branches.map((branch) => (
                      <li
                        key={branch.id}
                        className="flex items-center justify-between gap-3 rounded-btn border border-line bg-white px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="font-display text-sm font-semibold text-ink">{branch.name}</p>
                          <p className="truncate text-sm text-ink-soft">{branch.address}</p>
                        </div>
                        <Badge tone={branch.quantity <= 5 ? "low" : "ok"}>{branch.quantity} u.</Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <ProductActions product={product} />

              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-soft">
                <span className="flex items-center gap-2">
                  <IconTruck className="h-5 w-5 text-brand-500" />
                  Delivery a domicilio
                </span>
                <span className="flex items-center gap-2">
                  <IconStore className="h-5 w-5 text-brand-500" />
                  Retiro en sucursal
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 1 ? (
        <Section title="También te puede servir" align="center" className="bg-surface">
          <ProductGrid products={related.filter((item) => item.id !== product.id).slice(0, 4)} />
        </Section>
      ) : null}
    </div>
  );
};

export default ProductPage;
