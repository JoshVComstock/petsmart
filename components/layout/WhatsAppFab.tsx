import { IconWhatsApp } from "@/components/ui/icons";
import { STORE } from "@/lib/config";

/** Botón flotante de WhatsApp: consulta rápida desde cualquier página. */

export const WhatsAppFab = () => (
  <a
    href={`https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(
      `Hola ${STORE.name}, tengo una consulta.`
    )}`}
    target="_blank"
    rel="noreferrer"
    aria-label="Consultar por WhatsApp"
    className="fixed bottom-24 right-4 z-40 grid h-12 w-12 place-items-center rounded-full bg-whatsapp text-white shadow-lg shadow-whatsapp/30 transition-transform hover:scale-105 active:scale-95 md:bottom-6 md:right-6 md:h-14 md:w-14"
  >
    <IconWhatsApp className="h-6 w-6" />
  </a>
);
