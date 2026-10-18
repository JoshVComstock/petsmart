"use client";

import Link from "next/link";
import { useActionState, useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { IconCheck, IconPackage, IconQr, IconStore, IconTruck, IconWhatsApp } from "@/components/ui/icons";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/use-cart";
import { confirmAccountOrderAction, type CheckoutState } from "@/lib/actions/order";
import type { PaymentChoice } from "@/lib/whatsapp";
import type { Address, Branch, StoreClient } from "@/lib/types";

/**
 * Cierre del pedido desde la cuenta.
 *
 * Acá la persona ya está identificada, así que el pedido se hace con el
 * sistema: se confirma, queda registrado y aparece en "Mis pedidos" con su
 * código. Avisar por WhatsApp queda como algo opcional después, no como la
 * única manera de mandarlo.
 */

interface OpcionProps {
  active:   boolean;
  icon:     ReactNode;
  title:    string;
  subtitle: string;
  onClick:  () => void;
}

const Opcion = ({ active, icon, title, subtitle, onClick }: OpcionProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`flex flex-col items-center gap-1 rounded-btn border p-3 transition-colors ${
      active ? "border-ink bg-surface" : "border-line bg-white hover:border-ink/40"
    }`}
  >
    <span className={active ? "text-brand-500" : "text-ink-soft"}>{icon}</span>
    <span className="font-display text-sm font-semibold text-ink">{title}</span>
    <span className="text-[11px] text-ink-soft">{subtitle}</span>
  </button>
);

const Campo = ({
  label, name, required, placeholder, defaultValue,
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
}) => (
  <label className="block">
    <span className="font-display text-xs font-semibold text-ink-soft">{label}</span>
    <input
      name={name}
      required={required}
      placeholder={placeholder}
      defaultValue={defaultValue}
      className="mt-1.5 w-full rounded-btn border border-line bg-white px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-ink"
    />
  </label>
);

interface Props {
  branches:  Branch[];
  client:    StoreClient;
  addresses: Address[];
}

const IDLE: CheckoutState = { ok: false, message: "" };

export const AccountCheckout = ({ branches, client, addresses }: Props) => {
  const { lines, subtotal, clear } = useCart();
  const [isPickup, setIsPickup] = useState(false);
  const [payment, setPayment]   = useState<PaymentChoice>("qr");

  const predeterminada = addresses.find((a) => a.isDefault) ?? addresses[0] ?? null;
  const [addressId, setAddressId] = useState<number | null>(predeterminada?.id ?? null);
  const elegida = addresses.find((a) => a.id === addressId) ?? null;

  const [state, action] = useActionState(async (prev: CheckoutState, form: FormData) => {
    const result = await confirmAccountOrderAction(prev, form);
    if (result.ok) clear();
    return result;
  }, IDLE);

  if (state.ok && state.code) {
    return (
      <div className="rounded-card border border-line bg-white p-6 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success/10 text-success">
          <IconCheck className="h-7 w-7" />
        </span>

        <h2 className="mt-4 font-display text-lg font-semibold text-ink">
          Pedido {state.code} confirmado
        </h2>
        <p className="mt-2 text-sm text-ink-body">
          Ya quedó registrado a tu nombre. Lo preparamos y te avisamos cuando esté listo.
        </p>

        <Link
          href="/cuenta/pedidos"
          className="mt-5 flex h-11 items-center justify-center gap-2 rounded-btn bg-ink font-display text-sm font-semibold text-white transition-colors hover:bg-ink/85"
        >
          <IconPackage className="h-4 w-4" />
          Ver mis pedidos
        </Link>

        <a
          href={`https://wa.me/?text=${encodeURIComponent(`Hola, acabo de hacer el pedido ${state.code} desde mi cuenta.`)}`}
          target="_blank"
          rel="noreferrer"
          className="mt-2 flex h-11 items-center justify-center gap-2 rounded-btn border border-line font-display text-sm font-semibold text-ink transition-colors hover:border-whatsapp"
        >
          <IconWhatsApp className="h-4 w-4 text-whatsapp" />
          Avisar por WhatsApp (opcional)
        </a>
      </div>
    );
  }

  if (!client.emailVerified) {
    return (
      <div className="rounded-card border border-brand-200 bg-brand-50 p-5">
        <p className="font-display text-sm font-semibold text-ink">Confirmá tu correo primero</p>
        <p className="mt-1 text-sm text-ink-body">
          Para hacer pedidos desde tu cuenta necesitamos confirmar tu correo. Escribí el código
          de 6 dígitos que te mandamos; está en el aviso de arriba.
        </p>
        <Link
          href="/cuenta"
          className="mt-4 flex h-11 items-center justify-center rounded-btn bg-ink font-display text-sm font-semibold text-white transition-colors hover:bg-brand-500"
        >
          Ir a confirmar
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-line bg-white p-6 text-center">
        <p className="font-display text-sm font-semibold text-ink">Tu pedido está vacío</p>
        <p className="mt-1 text-xs text-ink-soft">
          Elegí productos de la lista y aparecen acá.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="rounded-card border border-line bg-white p-4 md:p-5">
      <input type="hidden" name="lines" value={JSON.stringify(lines)} />
      <input type="hidden" name="method" value={isPickup ? "PICKUP" : "DELIVERY"} />
      <input type="hidden" name="payment" value={isPickup ? payment : "qr"} />

      <h2 className="font-display text-lg font-semibold text-ink">Confirmar pedido</h2>
      <p className="mt-1 text-xs text-ink-soft">
        A nombre de {client.name} · {client.phone}
      </p>

      <fieldset className="mt-4">
        <legend className="font-display text-xs font-semibold text-ink-soft">
          ¿Cómo lo recibís?
        </legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Opcion
            active={!isPickup}
            icon={<IconTruck className="h-5 w-5" />}
            title="Delivery"
            subtitle="A tu domicilio"
            onClick={() => setIsPickup(false)}
          />
          <Opcion
            active={isPickup}
            icon={<IconStore className="h-5 w-5" />}
            title="Retiro"
            subtitle="En sucursal"
            onClick={() => setIsPickup(true)}
          />
        </div>
      </fieldset>

      <div className="mt-4 flex flex-col gap-3">
        {isPickup ? (
          <label className="block">
            <span className="font-display text-xs font-semibold text-ink-soft">
              Sucursal para retirar
            </span>
            <select
              name="branchId"
              required
              className="mt-1.5 w-full rounded-btn border border-line bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-ink"
            >
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name} — {branch.address}
                </option>
              ))}
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
                  className="mt-1.5 w-full rounded-btn border border-line bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-ink"
                >
                  {addresses.map((address) => (
                    <option key={address.id} value={address.id}>
                      {address.label} — {address.address}
                    </option>
                  ))}
                  <option value="">Usar otra dirección</option>
                </select>
              </label>
            ) : (
              <p className="rounded-btn bg-surface px-4 py-2.5 text-xs text-ink-body">
                Todavía no guardaste direcciones.{" "}
                <Link href="/cuenta/ubicaciones" className="font-semibold text-brand-600">
                  Cargá una
                </Link>{" "}
                y la próxima vez se completa sola.
              </p>
            )}

            <Campo
              key={`address-${addressId ?? "nueva"}`}
              label="Dirección de entrega"
              name="address"
              required
              placeholder="Av. Siempre Viva 742"
              defaultValue={elegida?.address ?? ""}
            />
            <Campo
              key={`reference-${addressId ?? "nueva"}`}
              label="Referencia o link de mapa"
              name="reference"
              placeholder="Portón verde, frente a la plaza"
              defaultValue={elegida?.reference ?? elegida?.mapsUrl ?? ""}
            />
          </>
        )}

        <Campo label="Nota (opcional)" name="notes" placeholder="Llamar antes de llegar" />
      </div>

      <fieldset className="mt-4">
        <legend className="font-display text-xs font-semibold text-ink-soft">¿Cómo pagás?</legend>

        {isPickup ? (
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Opcion
              active={payment === "qr"}
              icon={<IconQr className="h-5 w-5" />}
              title="Ahora por QR"
              subtitle="Te lo mandamos"
              onClick={() => setPayment("qr")}
            />
            <Opcion
              active={payment === "on_pickup"}
              icon={<IconStore className="h-5 w-5" />}
              title="Al recoger"
              subtitle="Pagás en la tienda"
              onClick={() => setPayment("on_pickup")}
            />
          </div>
        ) : (
          <p className="mt-2 flex items-start gap-2 rounded-btn bg-surface px-3 py-2.5 text-xs text-ink-body">
            <IconQr className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
            <span>
              El delivery se paga por adelantado. Te pasamos el QR cuando confirmemos el pedido.
            </span>
          </p>
        )}
      </fieldset>

      {state.message && !state.ok ? (
        <p role="alert" className="mt-4 rounded-btn bg-danger/10 px-4 py-2.5 text-sm text-danger">
          {state.message}
        </p>
      ) : null}

      <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
        <span className="font-display text-sm font-semibold text-ink-soft">Total</span>
        <span className="font-display text-2xl font-semibold text-ink">
          {formatPrice(subtotal)}
        </span>
      </div>

      <BotonConfirmar />

      <p className="mt-2 text-center text-[11px] text-ink-soft">
        Al confirmar aceptás los{" "}
        <Link href="/terminos" className="font-semibold text-brand-600 hover:underline">
          términos y condiciones
        </Link>
        . Lo seguís desde “Mis pedidos”.
      </p>
    </form>
  );
};

/** Separado para poder usar useFormStatus, que lee el <form> padre. */
const BotonConfirmar = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-btn bg-ink font-display text-sm font-semibold text-white transition-colors hover:bg-ink/85 disabled:opacity-60"
    >
      <IconCheck className="h-4 w-4" />
      {pending ? "Confirmando…" : "Hacer el pedido"}
    </button>
  );
};
