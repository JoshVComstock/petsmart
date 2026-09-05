"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";
import { IconCheck, IconStore, IconTruck, IconWhatsApp } from "@/components/ui/icons";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/use-cart";
import { createOrderAction, type CheckoutState } from "@/lib/actions/order";
import type { Address, Branch, StoreClient } from "@/lib/types";

/**
 * Cierre del pedido.
 *
 * Funciona igual con cuenta o sin cuenta: sin sesión pide nombre y teléfono,
 * con sesión los toma de la cuenta y ofrece las direcciones guardadas.
 *
 * Al enviar, la Server Action registra el pedido y devuelve el link de
 * WhatsApp con el código adentro. Recién ahí se vacía el carrito y se abre
 * el chat.
 */

interface MethodProps {
  active: boolean;
  icon: ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
}

const MethodOption = ({ active, icon, title, subtitle, onClick }: MethodProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`flex flex-col items-center gap-1.5 rounded-btn border p-4 transition-colors ${
      active ? "border-ink bg-surface" : "border-line bg-white hover:border-ink/40"
    }`}
  >
    <span className={active ? "text-brand-500" : "text-ink-soft"}>{icon}</span>
    <span className="font-display text-sm font-semibold text-ink">{title}</span>
    <span className="text-xs text-ink-soft">{subtitle}</span>
  </button>
);

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
}

const Field = ({ label, name, type = "text", required, placeholder, defaultValue }: FieldProps) => (
  <label className="block">
    <span className="font-display text-xs font-semibold text-ink-soft">{label}</span>
    <input
      name={name}
      type={type}
      required={required}
      placeholder={placeholder}
      defaultValue={defaultValue}
      className="mt-1.5 w-full rounded-btn border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-ink"
    />
  </label>
);

interface Props {
  branches: Branch[];
  client: StoreClient | null;
  addresses: Address[];
}

const IDLE: CheckoutState = { ok: false, message: "" };

export const Checkout = ({ branches, client, addresses }: Props) => {
  const { lines, subtotal, clear } = useCart();
  const [isPickup, setIsPickup] = useState(false);

  const defaultAddress = addresses.find((address) => address.isDefault) ?? addresses[0] ?? null;
  const [addressId, setAddressId] = useState<number | null>(defaultAddress?.id ?? null);
  const selected = addresses.find((address) => address.id === addressId) ?? null;

  // La acción se envuelve del lado del cliente para poder vaciar el carrito y
  // saltar a WhatsApp una vez que el pedido quedó registrado. Sin useEffect.
  const [state, action] = useActionState(async (prev: CheckoutState, form: FormData) => {
    const result = await createOrderAction(prev, form);

    if (result.ok && result.whatsappUrl) {
      clear();
      window.location.assign(result.whatsappUrl);
    }

    return result;
  }, IDLE);

  // Pedido registrado: se muestra el código por si WhatsApp no llegó a abrir.
  if (state.ok && state.code) {
    return (
      <div className="rounded-card border border-line bg-white p-6 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/10 text-success">
          <IconCheck className="h-7 w-7" />
        </span>

        <h2 className="mt-5 font-display text-xl font-semibold text-ink">
          Pedido {state.code} registrado
        </h2>
        <p className="mt-2 text-sm text-ink-body">
          Te estamos abriendo WhatsApp para que lo mandes. Si no se abrió solo, tocá el botón.
        </p>

        <a
          href={state.whatsappUrl}
          className="mt-6 flex h-[52px] items-center justify-center gap-2.5 rounded-btn bg-whatsapp font-display text-base font-semibold text-white transition-opacity hover:opacity-90"
        >
          <IconWhatsApp className="h-5 w-5" />
          Abrir WhatsApp
        </a>

        <Link
          href={client ? "/cuenta/pedidos" : "/productos"}
          className="mt-3 block text-sm text-ink-soft transition-colors hover:text-brand-500"
        >
          {client ? "Ver mis pedidos" : "Seguir comprando"}
        </Link>
      </div>
    );
  }

  if (lines.length === 0) return null;

  return (
    <form action={action} className="rounded-card border border-line bg-white p-5 md:p-6">
      {/* El carrito vive en localStorage: viaja al servidor por acá. */}
      <input type="hidden" name="lines" value={JSON.stringify(lines)} />
      <input type="hidden" name="method" value={isPickup ? "PICKUP" : "DELIVERY"} />

      <h2 className="font-display text-xl font-semibold text-ink">Finalizar pedido</h2>

      {!client ? (
        <p className="mt-3 rounded-btn bg-surface px-4 py-3 text-sm text-ink-body">
          Podés pedir sin cuenta.{" "}
          <Link href="/ingresar?volver=/carrito" className="font-semibold text-brand-500 hover:underline">
            Entrá
          </Link>{" "}
          si querés que te quede guardado en tu historial.
        </p>
      ) : null}

      {/* Método de entrega */}
      <fieldset className="mt-5">
        <legend className="font-display text-xs font-semibold text-ink-soft">
          ¿Cómo lo recibís?
        </legend>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <MethodOption
            active={!isPickup}
            icon={<IconTruck className="h-6 w-6" />}
            title="Delivery"
            subtitle="A tu domicilio"
            onClick={() => setIsPickup(false)}
          />
          <MethodOption
            active={isPickup}
            icon={<IconStore className="h-6 w-6" />}
            title="Retiro"
            subtitle="En sucursal"
            onClick={() => setIsPickup(true)}
          />
        </div>
      </fieldset>

      <div className="mt-5 flex flex-col gap-3">
        {/* Con sesión los datos ya están; sin sesión hay que pedirlos. */}
        {client ? (
          <p className="rounded-btn bg-surface px-4 py-3 text-sm text-ink-body">
            El pedido sale a nombre de <strong className="text-ink">{client.name}</strong> ·{" "}
            {client.phone}
          </p>
        ) : (
          <>
            <Field label="Nombre y apellido" name="name" required placeholder="Ana Pérez" />
            <Field label="Teléfono" name="phone" type="tel" required placeholder="700 00 000" />
          </>
        )}

        {isPickup ? (
          <label className="block">
            <span className="font-display text-xs font-semibold text-ink-soft">
              Sucursal para retirar
            </span>
            <select
              name="branchId"
              required
              className="mt-1.5 w-full rounded-btn border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ink"
            >
              {branches.length === 0 ? (
                <option value="">Sin sucursales disponibles</option>
              ) : (
                branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name} — {branch.address}
                  </option>
                ))
              )}
            </select>
          </label>
        ) : (
          <>
            {addresses.length > 0 ? (
              <label className="block">
                <span className="font-display text-xs font-semibold text-ink-soft">
                  Dirección guardada
                </span>
                <select
                  value={addressId ?? ""}
                  onChange={(event) => setAddressId(Number(event.target.value) || null)}
                  className="mt-1.5 w-full rounded-btn border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ink"
                >
                  {addresses.map((address) => (
                    <option key={address.id} value={address.id}>
                      {address.label} — {address.address}
                    </option>
                  ))}
                  <option value="">Usar otra dirección</option>
                </select>
              </label>
            ) : null}

            {/* key fuerza el remontaje al cambiar de dirección guardada, para
                que los defaultValue tomen el valor nuevo. */}
            <Field
              key={`address-${addressId ?? "nueva"}`}
              label="Dirección de entrega"
              name="address"
              required
              placeholder="Av. Siempre Viva 742"
              defaultValue={selected?.address ?? ""}
            />
            <Field
              key={`reference-${addressId ?? "nueva"}`}
              label="Referencia o link de Google Maps"
              name="reference"
              placeholder="Portón verde, frente a la plaza"
              defaultValue={selected?.reference ?? selected?.mapsUrl ?? ""}
            />
          </>
        )}

        <Field
          label="Nota para el pedido (opcional)"
          name="notes"
          placeholder="Llamar antes de llegar"
        />
      </div>

      {state.message && !state.ok ? (
        <p role="alert" className="mt-5 rounded-btn bg-danger/10 px-4 py-3 text-sm text-danger">
          {state.message}
        </p>
      ) : null}

      <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
        <span className="font-display text-sm font-semibold text-ink-soft">Total</span>
        <span className="font-display text-[28px] font-semibold text-ink">
          {formatPrice(subtotal)}
        </span>
      </div>

      <CheckoutSubmit />

      <p className="mt-3 text-center text-xs text-ink-soft">
        Registramos tu pedido y abrimos WhatsApp con el detalle listo. Confirmamos stock y
        coordinamos el pago.
      </p>
    </form>
  );
};

/** Separado para poder usar useFormStatus, que lee el <form> padre. */
const CheckoutSubmit = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-4 flex h-[52px] w-full items-center justify-center gap-2.5 rounded-btn bg-whatsapp font-display text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      <IconWhatsApp className="h-5 w-5" />
      {pending ? "Registrando tu pedido…" : "Enviar pedido por WhatsApp"}
    </button>
  );
};
