import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconCheck, IconClock, IconPaw, IconScissors } from "@/components/ui/icons";
import { getGroomingCatalog } from "@/lib/api";
import { SIZE_LABELS } from "@/lib/config";
import type { GroomingPackage } from "@/lib/types";

export const metadata: Metadata = {
  title: "Peluquería",
  description: "Baño, corte y cuidado para tu mascota. Reservá tu turno online.",
};

const DIAS = ["lunes", "martes", "miércoles", "jueves", "viernes"];

const ServiceCard = ({ pkg }: { pkg: GroomingPackage }) => {
  const incluye = pkg.description.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <article className="flex flex-col overflow-hidden rounded-card border border-line bg-white">
      <div className="relative h-[200px] bg-surface">
        {pkg.photo ? (
          <Image src={pkg.photo} alt={pkg.title} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" unoptimized />
        ) : (
          <div className="grid h-full place-items-center bg-gradient-to-br from-brand-100 to-brand-200 text-brand-500">
            <IconScissors className="h-14 w-14" />
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 font-display text-[11px] font-semibold text-ink">
          desde {pkg.fromPrice.toFixed(2)} Bs
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-semibold text-ink">{pkg.title}</h3>
        {pkg.tagline ? <p className="mt-1 text-sm text-ink-soft">{pkg.tagline}</p> : null}

        <ul className="mt-4 flex flex-1 flex-col gap-2">
          {incluye.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-ink-body">
              <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-5 overflow-hidden rounded-btn border border-line">
          {pkg.prices.map((p) => (
            <div
              key={p.serviceId}
              className="flex items-center justify-between border-b border-line px-4 py-2.5 last:border-b-0"
            >
              <span className="text-sm text-ink-body">{SIZE_LABELS[p.size] ?? p.size}</span>
              <span className="font-display text-sm font-semibold text-ink">{p.price.toFixed(2)} Bs</span>
            </div>
          ))}
        </div>

        <Link
          href={`/peluqueria/reservar?servicio=${pkg.type}`}
          className="mt-5 inline-flex h-12 items-center justify-center rounded-btn bg-ink font-display text-base font-semibold text-white transition-colors hover:bg-ink/85"
        >
          Reservar turno
        </Link>
      </div>
    </article>
  );
};

const GroomingPage = async () => {
  const { packages, extras, schedule } = await getGroomingCatalog();

  return (
    <>
      <PageHero
        eyebrow="Peluquería"
        title="Baño, corte y mimos"
        subtitle={`Atendemos de ${DIAS[0]} a ${DIAS[DIAS.length - 1]}, de ${schedule.openHour}:00 a ${schedule.closeHour}:00. Turnos de una hora, una mascota por turno.`}
      />

      <section className="bg-white px-4 py-12 md:px-8 md:py-[60px] lg:px-[72px]">
        <div className="mx-auto max-w-[1296px]">
          {packages.length === 0 ? (
            <EmptyState
              icon={<IconScissors className="h-7 w-7" />}
              title="Todavía no hay servicios publicados"
              message="Escribinos y coordinamos el turno por WhatsApp."
              actionHref="/sucursales"
              actionLabel="Ver sucursales"
            />
          ) : (
            <>
              <h2 className="font-display text-2xl font-semibold text-ink md:text-[32px]">
                Nuestros servicios
              </h2>
              <p className="mt-2 text-base text-ink-soft">
                El precio depende del tamaño de tu mascota.
              </p>

              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {packages.map((pkg) => (
                  <ServiceCard key={pkg.type} pkg={pkg} />
                ))}
              </div>
            </>
          )}

          {extras.length > 0 ? (
            <div className="mt-14">
              <h2 className="font-display text-2xl font-semibold text-ink md:text-[32px]">
                Servicios adicionales
              </h2>
              <p className="mt-2 text-base text-ink-soft">
                Se agregan al turno y se suman al total.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {extras.map((extra) => (
                    <div
                      key={extra.id}
                      className="flex items-center gap-4 rounded-card border border-line bg-white p-4"
                    >
                      <span className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-btn bg-surface text-brand-500">
                        {extra.photo ? (
                          <Image src={extra.photo} alt={extra.name} fill sizes="56px" className="object-cover" unoptimized />
                        ) : (
                          <IconPaw className="h-6 w-6" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-base font-semibold text-ink">{extra.name}</p>
                        {extra.description ? (
                          <p className="mt-0.5 text-sm text-ink-soft">{extra.description}</p>
                        ) : null}
                      </div>
                      <span className="shrink-0 font-display text-base font-semibold text-brand-500">
                        {extra.price.toFixed(2)} Bs
                      </span>
                    </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-14 flex flex-col items-start gap-4 rounded-card border border-line bg-surface p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <IconClock className="mt-0.5 h-6 w-6 shrink-0 text-brand-500" />
              <div>
                <p className="font-display text-lg font-semibold text-ink">Cómo funciona</p>
                <p className="mt-1 text-sm text-ink-body">
                  Elegís servicio y mascota, reservás día y hora, y pagás en la tienda o por QR.
                  Se reserva con {schedule.minHoursAhead} horas de anticipación como mínimo.
                </p>
              </div>
            </div>
            <Link
              href="/peluqueria/reservar"
              className="inline-flex h-12 shrink-0 items-center rounded-btn bg-brand-500 px-7 font-display text-base font-semibold text-white transition-colors hover:bg-brand-600"
            >
              Reservar turno
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default GroomingPage;
