import { STORE } from "./config";
import { formatPrice } from "./format";
import type { CartLine } from "./cart-store";

export type DeliveryMethod = "delivery" | "pickup";

export interface CheckoutData {
  /** Código del pedido ya registrado en el sistema, ej. "PED-00042" */
  code?: string
  name: string;
  phone: string;
  method: DeliveryMethod;
  /** Dirección de entrega (delivery) */
  address?: string;
  /** Referencia o link de Google Maps (delivery) */
  reference?: string;
  /** Sucursal elegida para retirar (pickup) */
  branchName?: string;
  notes?: string;
}

/** Arma el mensaje del pedido y devuelve el link de WhatsApp listo para abrir. */
export const buildWhatsAppOrder = (
  lines: CartLine[],
  data: CheckoutData,
  subtotal: number
) => {
  const items = lines
    .map(
      (l, i) =>
        `${i + 1}. ${l.name}\n` +
        `   ${l.quantity} x ${formatPrice(l.price)} = *${formatPrice(l.quantity * l.price)}*` +
        (l.branchName ? `\n   Sucursal: ${l.branchName}` : "")
    )
    .join("\n");

  const entrega =
    data.method === "delivery"
      ? `🛵 *Delivery*\n` +
        `Dirección: ${data.address ?? "-"}` +
        (data.reference ? `\nReferencia: ${data.reference}` : "")
      : `🏪 *Retiro en tienda*\n` + `Sucursal: ${data.branchName ?? "-"}`;

  const message =
    `¡Hola ${STORE.name}! 👋 Quiero hacer este pedido:\n\n` +
    // El código deja el pedido rastreable en los dos lados de la conversación.
    (data.code ? `🔖 *${data.code}*\n\n` : '') +
    `🛒 *PEDIDO*\n${items}\n\n` +
    `💰 *Total: ${formatPrice(subtotal)}*\n\n` +
    `👤 *DATOS*\n` +
    `Nombre: ${data.name}\n` +
    `Teléfono: ${data.phone}\n\n` +
    `${entrega}` +
    (data.notes ? `\n\n📝 Nota: ${data.notes}` : "");

  return `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(message)}`;
};
