import type { Metadata } from "next";
import { ProductGrid } from "@/components/product/ProductGrid";
import { apiGet } from "@/lib/store-api";
import type { Product } from "@/lib/types";

export const metadata: Metadata = { title: "Favoritos" };

const FavoritesPage = async () => {
  const result = await apiGet<Product[]>("/account/favorites");
  const products = result.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="font-display text-2xl font-semibold text-ink">Favoritos</h2>
        <p className="mt-1.5 text-base text-ink-soft">
          Lo que guardaste con el corazón, listo para volver a pedir.
        </p>
      </header>

      <ProductGrid
        products={products}
        columns={3}
        emptyTitle="Todavía no guardaste nada"
        emptyMessage="Tocá el corazón de cualquier producto para tenerlo a mano acá."
      />
    </div>
  );
};

export default FavoritesPage;
