import { IconShield, IconStore, IconTruck } from "@/components/ui/icons";

/** Tres motivos para comprar, en la fila de tarjetas blancas del diseño. */

const BENEFITS = [
  {
    Icon: IconTruck,
    title: "Delivery a domicilio",
    text: "Coordinamos la entrega por WhatsApp el mismo día.",
  },
  {
    Icon: IconStore,
    title: "Retiro en sucursal",
    text: "Reservá online y pasá a buscarlo cuando quieras.",
  },
  {
    Icon: IconShield,
    title: "Stock real",
    text: "Lo que ves publicado es lo que hay en tienda.",
  },
] as const;

export const Benefits = () => (
  <div className="grid gap-4 md:grid-cols-3 md:gap-6">
    {BENEFITS.map(({ Icon, title, text }) => (
      <div
        key={title}
        className="flex items-start gap-4 rounded-card border border-line bg-white p-6"
      >
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-500">
          <Icon className="h-6 w-6" />
        </span>
        <div>
          <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{text}</p>
        </div>
      </div>
    ))}
  </div>
);
