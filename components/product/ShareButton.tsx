"use client";

import { IconWhatsApp } from "@/components/ui/icons";
import { mostrarToast } from "@/components/ui/Toast";
import { formatPrice } from "@/lib/format";

/**
 * Compartir el producto.
 *
 * En el celular usa el menú del sistema; en escritorio copia el link. El
 * mensaje lleva nombre y precio, y el link trae su propia vista previa
 * (ver generateMetadata de la página del producto).
 */

interface Props {
  id:    number;
  name:  string;
  price: number;
}

export const ShareButton = ({ id, name, price }: Props) => {
  const compartir = async () => {
    const url = `${window.location.origin}/productos/${id}`;
    const texto = price > 0 ? `${name} — ${formatPrice(price)}` : name;

    if (navigator.share) {
      try {
        await navigator.share({ title: name, text: texto, url });
        return;
      } catch {
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(`${texto}\n${url}`);
      mostrarToast({ mensaje: "Link copiado", detalle: "Ya lo podés pegar donde quieras." });
    } catch {
      mostrarToast({ mensaje: "No pudimos copiar el link", tono: "error" });
    }
  };

  const whatsapp = () => {
    const url = `${window.location.origin}/productos/${id}`;
    const texto = price > 0 ? `${name} — ${formatPrice(price)}\n${url}` : `${name}\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank", "noreferrer");
  };

  return (
    <div className="mt-6 flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={compartir}
        className="inline-flex items-center gap-2 rounded-btn border border-line bg-white px-4 py-2 font-display text-sm font-semibold text-ink transition-colors hover:border-ink"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
          <path
            d="M18 8a3 3 0 1 0-2.83-4M18 8a3 3 0 1 1-2.83 4M18 8l-9 4m0 0a3 3 0 1 1-3 0m3 0 9 4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Compartir
      </button>

      <button
        type="button"
        onClick={whatsapp}
        aria-label="Compartir por WhatsApp"
        className="inline-flex items-center gap-2 rounded-btn border border-line bg-white px-4 py-2 font-display text-sm font-semibold text-ink transition-colors hover:border-whatsapp"
      >
        <IconWhatsApp className="h-4 w-4 text-whatsapp" />
        WhatsApp
      </button>
    </div>
  );
};
