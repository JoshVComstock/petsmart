import { Blob } from "@/components/ui/Blob";
import { Button } from "@/components/ui/Button";
import { PawPattern } from "@/components/ui/PawPattern";
import { IconWhatsApp } from "@/components/ui/icons";
import { STORE } from "@/lib/config";

/**
 * Bloque intermedio del template: mancha con ilustración a la izquierda
 * y el argumento de venta a la derecha. Acá explica el pedido por
 * WhatsApp, que es como funciona realmente la tienda.
 */

export const InfoBlock = () => (
  <section className="bg-surface px-4 py-12 md:px-8 md:py-[60px] lg:px-[72px]">
    <div className="mx-auto grid max-w-[1296px] items-center gap-10 lg:grid-cols-2 lg:gap-20">
      <div className="relative mx-auto aspect-square w-full max-w-[380px] lg:max-w-[440px]">
        <Blob variant={2} className="absolute inset-0 bg-brand-500" />
        <Blob variant={0} className="absolute inset-[14%] bg-brand-400" />
        <PawPattern className="text-white" />
        <span className="absolute inset-0 grid place-items-center text-white">
          <IconWhatsApp className="h-24 w-24 md:h-32 md:w-32" />
        </span>
      </div>

      <div className="flex flex-col items-start gap-5">
        <p className="font-display text-base font-bold capitalize text-brand-500">
          Pedidos
        </p>
        <h2 className="max-w-[587px] font-display text-[28px] font-semibold leading-tight text-ink md:text-[40px] md:leading-[48px]">
          La forma más simple de comprar para tu mascota
        </h2>
        <p className="max-w-[520px] text-base leading-relaxed text-ink-body">
          Armá el carrito con lo que necesites y enviá el pedido por WhatsApp en un toque.
          Confirmamos stock, coordinamos el pago y elegís si lo recibís en tu casa o lo
          retirás por la sucursal más cercana.
        </p>

        <Button href="/productos" size="lg" className="mt-2">
          Empezar a comprar
        </Button>

        <a
          href={`https://wa.me/${STORE.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="font-display text-base font-semibold text-ink underline-offset-4 transition-colors hover:text-brand-500 hover:underline"
        >
          O escribinos directo por WhatsApp
        </a>
      </div>
    </div>
  </section>
);
