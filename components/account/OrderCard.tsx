import { Badge } from "@/components/ui/Badge";
import { IconMapPin, IconStore, IconTruck } from "@/components/ui/icons";
import { formatPrice } from "@/lib/format";
import type { AccountOrder, OrderStatus } from "@/lib/types";

/** Un pedido en la lista de la cuenta, venga de la web o del mostrador. */

const STATUS: Record<OrderStatus, { label: string; tone: "brand" | "dark" | "ok" | "out" }> = {
  PENDING: { label: "Pendiente", tone: "brand" },
  CONFIRMED: { label: "Confirmado", tone: "dark" },
  READY: { label: "Listo", tone: "ok" },
  COMPLETED: { label: "Entregado", tone: "ok" },
  CANCELLED: { label: "Cancelado", tone: "out" },
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("es-BO", { day: "2-digit", month: "long", year: "numeric" });

export const OrderCard = ({ order }: { order: AccountOrder }) => {
  const status = STATUS[order.status] ?? STATUS.PENDING;

  return (
    <article className="rounded-card border border-line bg-white p-5 md:p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg font-semibold text-ink">{order.code}</p>
          <p className="mt-1 text-sm text-ink-soft">{formatDate(order.date)}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {order.source === "TIENDA" ? <Badge tone="neutral">En tienda</Badge> : null}
          <Badge tone={status.tone}>{status.label}</Badge>
        </div>
      </header>

      <ul className="mt-5 flex flex-col gap-2 border-t border-line pt-5">
        {order.items.map((item) => (
          <li key={`${order.key}-${item.productId}`} className="flex justify-between gap-4 text-sm">
            <span className="min-w-0 text-ink-body">
              <span className="font-semibold text-ink">{item.quantity}×</span> {item.name}
            </span>
            <span className="shrink-0 text-ink-soft">{formatPrice(item.subtotal)}</span>
          </li>
        ))}
      </ul>

      <footer className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
        <p className="flex items-center gap-2 text-sm text-ink-soft">
          {order.method === "PICKUP" ? (
            <>
              <IconStore className="h-4 w-4" />
              Retiro{order.branch ? ` en ${order.branch.name}` : ""}
            </>
          ) : order.method === "DELIVERY" ? (
            <>
              <IconTruck className="h-4 w-4" />
              Delivery a domicilio
            </>
          ) : (
            <>
              <IconMapPin className="h-4 w-4" />
              {order.branch?.name ?? "Mostrador"}
            </>
          )}
        </p>

        <p className="font-display text-xl font-semibold text-ink">{formatPrice(order.total)}</p>
      </footer>
    </article>
  );
};
