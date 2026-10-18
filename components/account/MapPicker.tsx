"use client";

import { useState } from "react";
import { IconMapPin } from "@/components/ui/icons";
import { mostrarToast } from "@/components/ui/Toast";

/**
 * Punto exacto de la dirección.
 *
 * Sin librerías ni llaves de API: el mapa es un embed de OpenStreetMap y las
 * coordenadas salen del GPS del teléfono o del link de Google Maps que la
 * persona pega. Lo que se guarda sigue siendo mapsUrl, así el repartidor
 * abre el punto con un toque.
 */

/** Saca lat,lng de un link de Google Maps (@lat,lng, !3dlat!4dlng o q=lat,lng). */
export const leerCoordenadas = (url: string): [number, number] | null => {
  const patrones = [
    /@(-?\d+\.\d+),(-?\d+\.\d+)/,
    /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,
    /[?&]q=(-?\d+\.\d+),\s*(-?\d+\.\d+)/,
    /^(-?\d+\.\d+),\s*(-?\d+\.\d+)$/,
  ];

  for (const patron of patrones) {
    const encontrado = url.match(patron);
    if (encontrado) return [Number(encontrado[1]), Number(encontrado[2])];
  }

  return null;
};

const COCHABAMBA: [number, number] = [-17.3895, -66.1568];
const RADIO = 0.004;

const embedUrl = ([lat, lng]: [number, number], conPin: boolean) => {
  const caja = [lng - RADIO, lat - RADIO, lng + RADIO, lat + RADIO].join("%2C");
  const marcador = conPin ? `&marker=${lat}%2C${lng}` : "";
  return `https://www.openstreetmap.org/export/embed.html?bbox=${caja}&layer=mapnik${marcador}`;
};

const linkMaps = ([lat, lng]: [number, number]) =>
  `https://www.google.com/maps?q=${lat},${lng}`;

interface Props {
  name: string;
  defaultValue?: string | null;
}

export const MapPicker = ({ name, defaultValue }: Props) => {
  const [valor, setValor] = useState(defaultValue ?? "");
  const [buscando, setBuscando] = useState(false);

  const coords = leerCoordenadas(valor);
  const centro = coords ?? COCHABAMBA;

  const usarMiUbicacion = () => {
    if (!navigator.geolocation) {
      mostrarToast({ mensaje: "Tu navegador no comparte ubicación", tono: "error" });
      return;
    }

    setBuscando(true);
    navigator.geolocation.getCurrentPosition(
      (posicion) => {
        const punto: [number, number] = [
          Number(posicion.coords.latitude.toFixed(6)),
          Number(posicion.coords.longitude.toFixed(6)),
        ];
        setValor(linkMaps(punto));
        setBuscando(false);
        mostrarToast({ mensaje: "Listo, marcamos tu ubicación en el mapa" });
      },
      () => {
        setBuscando(false);
        mostrarToast({
          mensaje: "No pudimos leer tu ubicación",
          detalle: "Permití el acceso o pegá el link de Google Maps.",
          tono:    "error",
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="font-display text-xs font-semibold text-ink-soft">
        Punto en el mapa
      </span>

      <div className="overflow-hidden rounded-card border border-line">
        <iframe
          key={valor}
          title="Mapa de la dirección"
          src={embedUrl(centro, Boolean(coords))}
          loading="lazy"
          className="h-64 w-full border-0 sm:h-80"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={usarMiUbicacion}
          disabled={buscando}
          className="inline-flex items-center gap-2 rounded-btn border border-line bg-white px-3 py-2 font-display text-xs font-semibold text-ink transition-colors hover:border-ink disabled:opacity-60"
        >
          <IconMapPin className="h-4 w-4 text-brand-500" />
          {buscando ? "Buscando…" : "Usar mi ubicación"}
        </button>

        {coords ? (
          <a
            href={linkMaps(coords)}
            target="_blank"
            rel="noreferrer"
            className="font-display text-xs font-semibold text-brand-600 underline underline-offset-2"
          >
            Ver en Google Maps
          </a>
        ) : (
          <span className="text-xs text-ink-faint">
            Todavía sin punto exacto
          </span>
        )}
      </div>

      <input
        name={name}
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        placeholder="Pegá el link de Google Maps o -17.389, -66.156"
        className="w-full rounded-btn border border-line bg-white px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-ink"
      />
    </div>
  );
};
