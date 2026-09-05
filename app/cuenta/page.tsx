import Link from "next/link";
import { OrderCard } from "@/components/account/OrderCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconArrowRight, IconHeart, IconMapPin, IconPackage } from "@/components/ui/icons";
import { apiGet } from "@/lib/store-api";
import type { AccountOrder, Address, Product } from "@/lib/types";

/** Resumen de la cuenta: los números de un vistazo y el último pedido. */

interface Tile {
  href: string;
  label: string;
  value: number;
  Icon: (props: { className?: string }) => React.ReactElement;
}

const AccountHomePage = async () => {
  const [ordersResult, favoritesResult, addressesResult] = await Promise.all([
    apiGet<{ orders: AccountOrder[] }>("/account/orders"),
    apiGet<Product[]>("/account/favorites"),
    apiGet<Address[]>("/account/addresses"),
  ]);

  const orders = ordersResult.data?.orders ?? [];
  const tiles: Tile[] = [
    { href: "/cuenta/pedidos", label: "Pedidos", value: orders.length, Icon: IconPackage },
    { href: "/cuenta/favoritos", label: "Favoritos", value: favoritesResult.data?.length ?? 0, Icon: IconHeart },
    { href: "/cuenta/ubicaciones", label: "Ubicaciones", value: addressesResult.data?.length ?? 0, Icon: IconMapPin },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {tiles.map(({ href, label, value, Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center justify-between gap-3 rounded-card border border-line bg-white p-5 transition-colors hover:border-ink"
          >
            <span className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-50 text-brand-500">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-display text-2xl font-semibold text-ink">{value}</span>
                <span className="block text-sm text-ink-soft">{label}</span>
              </span>
            </span>
            <IconArrowRight className="h-5 w-5 shrink-0 text-ink-faint transition-transform group-hover:translate-x-1 group-hover:text-ink" />
          </Link>
        ))}
      </div>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="font-display text-xl font-semibold text-ink">Último pedido</h2>
          {orders.length > 0 ? (
            <Link
              href="/cuenta/pedidos"
              className="font-display text-sm font-semibold text-brand-500 hover:underline"
            >
              Ver todos
            </Link>
          ) : null}
        </div>

        {orders.length === 0 ? (
          <EmptyState
            icon={<IconPackage className="h-7 w-7" />}
            title="Todavía no hiciste pedidos"
            message="Cuando envíes tu primer pedido por WhatsApp va a aparecer acá."
            actionHref="/productos"
            actionLabel="Ver productos"
          />
        ) : (
          <OrderCard order={orders[0]} />
        )}
      </section>
    </div>
  );
};

export default AccountHomePage;
