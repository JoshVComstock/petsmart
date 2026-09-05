import Link from "next/link";
import { Logo } from "./Logo";
import { PawPattern } from "@/components/ui/PawPattern";
import { IconMapPin, IconPhone, IconWhatsApp } from "@/components/ui/icons";
import { BRANCHES, CONTACT, NAV_LINKS, STORE } from "@/lib/config";

/**
 * Pie del template: fondo blanco con huellas de marca de agua, bloque de
 * marca a la izquierda y tres columnas de links. Abajo, la línea legal.
 */

const SHOP_LINKS = [
  { href: "/productos", label: "Todo el catálogo" },
  { href: "/ofertas", label: "Productos en oferta" },
  { href: "/carrito", label: "Mi carrito" },
  { href: "/sucursales", label: "Dónde retirar" },
] as const;

export const Footer = () => (
  <footer className="relative mt-4 overflow-hidden border-t border-line bg-white">
    <PawPattern className="text-ink/[0.03]" />

    <div className="relative px-4 py-14 md:px-8 lg:px-[72px]">
      <div className="mx-auto grid max-w-[1296px] gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-8">
        {/* Marca */}
        <div className="flex flex-col items-start gap-5">
          <Logo />
          <p className="max-w-[349px] text-base leading-relaxed text-ink-body">
            {STORE.description}
          </p>
          <a
            href={`https://wa.me/${STORE.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-btn bg-whatsapp px-5 py-3 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <IconWhatsApp className="h-5 w-5" />
            Escribinos por WhatsApp
          </a>
        </div>

        {/* Navegación */}
        <div>
          <h3 className="font-display text-base font-semibold text-ink">Tienda</h3>
          <ul className="mt-5 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-base text-ink transition-colors hover:text-brand-500">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Atajos de compra */}
        <div>
          <h3 className="font-display text-base font-semibold text-ink">Comprar</h3>
          <ul className="mt-5 flex flex-col gap-4">
            {SHOP_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-base text-ink transition-colors hover:text-brand-500">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacto: una entrada por sucursal, con su teléfono y su mapa */}
        <div>
          <h3 className="font-display text-base font-semibold text-ink">Nuestras tiendas</h3>
          <ul className="mt-5 flex flex-col gap-5 text-base text-ink">
            {BRANCHES.map((branch) => (
              <li key={branch.id} className="flex flex-col gap-1.5">
                <a
                  href={branch.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-2.5 font-display font-semibold transition-colors hover:text-brand-500"
                >
                  <IconMapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                  {branch.name}
                </a>
                <a
                  href={`https://wa.me/${branch.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-[30px] flex items-center gap-2 text-sm text-ink-body transition-colors hover:text-brand-500"
                >
                  <IconPhone className="h-4 w-4 shrink-0 text-brand-500" />
                  +591 {branch.phone}
                </a>
              </li>
            ))}
            <li className="flex items-start gap-2.5 text-sm text-ink-soft">
              <IconMapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
              {CONTACT.city}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div className="relative border-t border-line">
      <div className="mx-auto flex max-w-[1296px] flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-ink-soft md:flex-row md:px-8 lg:px-[72px]">
        <p>
          © {new Date().getFullYear()} {STORE.name}. Todos los derechos reservados.
        </p>
        <p>Coordinamos pago y entrega por WhatsApp.</p>
      </div>
    </div>
  </footer>
);
