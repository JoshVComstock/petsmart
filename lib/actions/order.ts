"use server";

import { apiPost } from "@/lib/store-api";
import { getSession } from "@/lib/session";
import { buildWhatsAppOrder } from "@/lib/whatsapp";
import type { CartLine } from "@/lib/cart-store";
import { field } from "./types";

/**
 * Cierre del pedido.
 *
 * El pedido se registra primero en el servidor y recién después se abre
 * WhatsApp, con el código adentro del mensaje. Así el pedido existe aunque el
 * chat se pierda, y el cliente lo ve en "Mis pedidos".
 *
 * Los precios los recalcula el backend desde los lotes: lo que manda el
 * carrito del navegador solo sirve para saber qué y cuánto.
 */

export interface CheckoutState {
  ok: boolean;
  message: string;
  /** Presentes solo cuando el pedido se registró bien */
  code?: string;
  whatsappUrl?: string;
}

interface OrderResponse {
  code: string;
  subtotal: number;
}

export const createOrderAction = async (
  _prev: CheckoutState,
  form: FormData
): Promise<CheckoutState> => {
  const session = await getSession();

  // El carrito viaja como JSON en un campo oculto: vive en localStorage y el
  // servidor no lo puede leer de otra manera.
  let lines: CartLine[] = [];
  try {
    lines = JSON.parse(String(form.get("lines") ?? "[]")) as CartLine[];
  } catch {
    return { ok: false, message: "No pudimos leer tu carrito. Recargá la página." };
  }

  if (lines.length === 0) {
    return { ok: false, message: "Tu carrito está vacío" };
  }

  // El API habla en mayúsculas (DELIVERY/PICKUP) y el armador del mensaje de
  // WhatsApp en minúsculas. Se resuelve una sola vez, acá.
  const isPickup = field(form, "method") === "PICKUP";
  const method = isPickup ? "PICKUP" : "DELIVERY";

  const name = session?.name ?? field(form, "name");
  const phone = session?.phone ?? field(form, "phone");
  const address = field(form, "address");
  const reference = field(form, "reference");
  const notes = field(form, "notes");
  const branchId = Number(form.get("branchId")) || null;
  const branchName = field(form, "branchName");

  if (!name || !phone) {
    return { ok: false, message: "Dejanos tu nombre y teléfono para poder contactarte" };
  }

  const result = await apiPost<OrderResponse>("/orders", {
    method,
    items: lines.map((line) => ({
      productId: line.productId,
      quantity: line.quantity,
      branchId: line.branchId,
    })),
    ...(session ? {} : { guestName: name, guestPhone: phone }),
    ...(isPickup ? { branchId } : { address, reference }),
    notes,
  });

  if (!result.ok || !result.data) {
    return { ok: false, message: result.message };
  }

  const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.price, 0);

  const whatsappUrl = buildWhatsAppOrder(
    lines,
    {
      code: result.data.code,
      name,
      phone,
      method: isPickup ? "pickup" : "delivery",
      address,
      reference,
      branchName,
      notes,
    },
    subtotal
  );

  return {
    ok: true,
    message: `Pedido ${result.data.code} registrado`,
    code: result.data.code,
    whatsappUrl,
  };
};
