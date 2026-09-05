import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { CartLines } from "@/components/cart/CartLines";
import { Checkout } from "@/components/cart/Checkout";
import { getBranches } from "@/lib/api";
import { getSession } from "@/lib/session";
import { apiGet } from "@/lib/store-api";
import type { Address } from "@/lib/types";

export const metadata: Metadata = { title: "Tu carrito" };

const CartPage = async () => {
  const [branches, client] = await Promise.all([getBranches(), getSession()]);

  // Las direcciones guardadas solo aplican si hay sesión.
  const addresses = client ? (await apiGet<Address[]>("/account/addresses")).data ?? [] : [];

  return (
    <>
      <PageHero
        eyebrow="Pedido"
        title="Tu carrito"
        subtitle="Revisá lo que llevás y elegí cómo lo querés recibir."
      />

      <div className="bg-white px-4 py-12 md:px-8 md:py-[60px] lg:px-[72px]">
        <div className="mx-auto grid max-w-[1296px] gap-6 lg:grid-cols-[1fr_400px] lg:items-start lg:gap-10">
          <CartLines />
          <div className="lg:sticky lg:top-32">
            <Checkout branches={branches} client={client} addresses={addresses} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
