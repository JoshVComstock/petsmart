"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { IconScissors, IconWhatsApp } from "@/components/ui/icons";
import { SIZE_LABELS, STORE } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import type { GroomingCatalog, GroomingExtra, GroomingPackage } from "@/lib/types";

/**
 * Pedido de turno para quien todavía no tiene cuenta.
 *
 * No reserva el horario: junta los datos y abre WhatsApp con el pedido
 * armado, igual que el resto de la tienda sin sesión. Para elegir el horario
 * exacto en la pantalla hace falta cuenta, y eso se ofrece al lado.
 */

type Tamano = keyof typeof SIZE_LABELS;

interface Props {
  catalog: GroomingCatalog;
}

const Campo = ({
  label, name, type = "text", required, placeholder, value, onChange,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <label className="block">
    <span className="font-display text-xs font-semibold text-ink-soft">{label}</span>
    <input
      name={name}
      type={type}
      required={required}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1.5 w-full rounded-btn border border-line bg-white px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-ink"
    />
  </label>
);

export const GuestBooking = ({ catalog }: Props) => {
  const { packages, extras } = catalog;

  const [pkg, setPkg] = useState<GroomingPackage | null>(packages[0] ?? null);
  const [size, setSize] = useState<Tamano>("MEDIUM");
  const [elegidos, setElegidos] = useState<number[]>([]);
  const [mascota, setMascota] = useState("");
  const [raza, setRaza] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [dia, setDia] = useState("");
  const [nota, setNota] = useState("");

  const precio = useMemo(
    () => pkg?.prices.find((p) => p.size === size)?.price ?? pkg?.fromPrice ?? 0,
    [pkg, size]
  );

  const extrasElegidos = extras.filter((extra) => elegidos.includes(extra.id));
  const total = precio + extrasElegidos.reduce((sum, extra) => sum + extra.price, 0);

  const completo = Boolean(pkg && mascota.trim() && nombre.trim() && telefono.trim());

  const toggleExtra = (extra: GroomingExtra) =>
    setElegidos((previos) =>
      previos.includes(extra.id)
        ? previos.filter((id) => id !== extra.id)
        : [...previos, extra.id]
    );

  const enlace = () => {
    const lineas = [
      `¡Hola ${STORE.name}! 👋 Quiero pedir un turno de peluquería:`,
      "",
      `✂️ *${pkg?.title ?? "Servicio"}* · ${SIZE_LABELS[size]}`,
      `🐾 Mascota: ${mascota}${raza ? ` (${raza})` : ""}`,
      extrasElegidos.length
        ? `➕ Extras: ${extrasElegidos.map((e) => e.name).join(", ")}`
        : null,
      dia ? `📅 Preferencia: ${dia}` : null,
      "",
      `💰 *Estimado: ${formatPrice(total)}*`,
      "",
      "👤 *DATOS*",
      `Nombre: ${nombre}`,
      `Teléfono: ${telefono}`,
      nota ? `\n📝 Nota: ${nota}` : null,
    ].filter((linea) => linea !== null);

    return `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(lineas.join("\n"))}`;
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      <div className="min-w-0 rounded-card border border-line bg-white p-4 md:p-5">
        <h2 className="font-display text-lg font-semibold text-ink">Pedí tu turno</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Completá los datos y seguimos por WhatsApp para confirmarte el horario.
        </p>

        <div className="mt-5">
          <p className="font-display text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Servicio
          </p>
          <div className="mt-2 flex flex-col gap-2">
            {packages.map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => setPkg(item)}
                className={`flex items-center justify-between gap-3 rounded-card border p-3 text-left transition-colors ${
                  pkg?.type === item.type ? "border-ink bg-surface" : "border-line hover:border-ink/40"
                }`}
              >
                <span className="min-w-0">
                  <span className="block font-display text-sm font-semibold text-ink">
                    {item.title}
                  </span>
                  {item.tagline ? (
                    <span className="block truncate text-xs text-ink-soft">{item.tagline}</span>
                  ) : null}
                </span>
                <span className="shrink-0 font-display text-sm font-semibold text-brand-600">
                  desde {formatPrice(item.fromPrice)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <p className="font-display text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Tamaño
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(Object.keys(SIZE_LABELS) as Tamano[]).map((clave) => (
              <button
                key={clave}
                type="button"
                onClick={() => setSize(clave)}
                className={`rounded-btn border px-4 py-2 font-display text-sm font-semibold transition-colors ${
                  size === clave ? "border-ink bg-ink text-white" : "border-line text-ink-body hover:border-ink/40"
                }`}
              >
                {SIZE_LABELS[clave]}
              </button>
            ))}
          </div>
        </div>

        {extras.length > 0 ? (
          <div className="mt-5">
            <p className="font-display text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Extras
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {extras.map((extra) => (
                <button
                  key={extra.id}
                  type="button"
                  onClick={() => toggleExtra(extra)}
                  className={`rounded-btn border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    elegidos.includes(extra.id)
                      ? "border-ink bg-ink text-white"
                      : "border-line text-ink-body hover:border-ink/40"
                  }`}
                >
                  {extra.name} +{formatPrice(extra.price)}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Campo label="Nombre de la mascota" name="mascota" required placeholder="Kira" value={mascota} onChange={setMascota} />
          <Campo label="Raza (opcional)" name="raza" placeholder="Schnauzer" value={raza} onChange={setRaza} />
          <Campo label="Tu nombre" name="nombre" required placeholder="Ana Pérez" value={nombre} onChange={setNombre} />
          <Campo label="Teléfono" name="telefono" type="tel" required placeholder="700 00 000" value={telefono} onChange={setTelefono} />
          <Campo label="Día y hora que preferís" name="dia" placeholder="Jueves por la mañana" value={dia} onChange={setDia} />
          <Campo label="Nota (opcional)" name="nota" placeholder="Es nerviosa con la secadora" value={nota} onChange={setNota} />
        </div>
      </div>

      <aside className="min-w-0 rounded-card border border-line bg-white p-4 lg:sticky lg:top-40">
        <p className="font-display text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Resumen
        </p>

        <div className="mt-3 flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-btn bg-brand-50 text-brand-500">
            <IconScissors className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="font-display text-sm font-semibold text-ink">
              {pkg?.title ?? "Elegí un servicio"}
            </p>
            <p className="text-xs text-ink-soft">{SIZE_LABELS[size]}</p>
          </div>
        </div>

        <dl className="mt-4 flex flex-col gap-1.5 border-t border-line pt-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-soft">Servicio</dt>
            <dd className="font-semibold text-ink">{formatPrice(precio)}</dd>
          </div>
          {extrasElegidos.map((extra) => (
            <div key={extra.id} className="flex justify-between">
              <dt className="truncate text-ink-soft">{extra.name}</dt>
              <dd className="shrink-0 font-semibold text-ink">+{formatPrice(extra.price)}</dd>
            </div>
          ))}
          <div className="mt-1 flex justify-between border-t border-line pt-2">
            <dt className="font-display font-semibold text-ink">Estimado</dt>
            <dd className="font-display text-base font-semibold text-ink">{formatPrice(total)}</dd>
          </div>
        </dl>

        <a
          href={completo ? enlace() : undefined}
          target="_blank"
          rel="noreferrer"
          aria-disabled={!completo}
          onClick={(e) => { if (!completo) e.preventDefault(); }}
          className={`mt-4 flex h-11 items-center justify-center gap-2 rounded-btn font-display text-sm font-semibold transition-colors ${
            completo
              ? "bg-whatsapp text-white hover:brightness-95"
              : "cursor-not-allowed bg-surface-2 text-ink-faint"
          }`}
        >
          <IconWhatsApp className="h-4 w-4" />
          Pedir por WhatsApp
        </a>

        <p className="mt-3 rounded-btn bg-surface px-3 py-2.5 text-xs text-ink-body">
          ¿Querés elegir el horario acá y seguir tus turnos?{" "}
          <Link href="/crear-cuenta?volver=/cuenta/turnos/reservar" className="font-semibold text-brand-600">
            Creá tu cuenta
          </Link>
          .
        </p>
      </aside>
    </div>
  );
};
