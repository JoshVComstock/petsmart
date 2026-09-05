import type { Metadata } from "next";
import { OrderCard } from "@/components/account/OrderCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconPackage } from "@/components/ui/icons";
import { apiGet } from "@/lib/store-api";
import type { AccountOrder } from "@/lib/types";

export const metadata: Metadata = { title: "Mis pedidos" };

interface OrdersResponse {
  orders: AccountOrder[];
  /** false mientras el correo no esté confirmado */
  showsInStorePurchases: boolean;
}

const OrdersPage = async () => {
  const result = await apiGet<OrdersResponse>("/account/orders");
  const orders = result.data?.orders ?? [];

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="font-display text-2xl font-semibold text-ink">Mis pedidos</h2>
        <p className="mt-1.5 text-base text-ink-soft">
          {result.data?.showsInStorePurchases
            ? "Incluye lo que pediste por la web y lo que compraste en el mostrador."
            : "Confirmá tu correo para ver también las compras que hiciste en el mostrador."}
        </p>
      </header>

      {orders.length === 0 ? (
        <EmptyState
          icon={<IconPackage className="h-7 w-7" />}
          title="Todavía no hiciste pedidos"
          message="Cuando envíes tu primer pedido por WhatsApp va a aparecer acá con su código."
          actionHref="/productos"
          actionLabel="Ver productos"
        />
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <OrderCard key={order.key} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
