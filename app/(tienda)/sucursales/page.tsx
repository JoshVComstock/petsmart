import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconMapPin, IconPhone } from "@/components/ui/icons";
import { getBranches } from "@/lib/api";
import { BRANCH_INFO } from "@/lib/config";

export const metadata: Metadata = { title: "Sucursales" };

const BranchesPage = async () => {
  const branches = await getBranches();

  return (
    <>
      <PageHero
        eyebrow="Dónde estamos"
        title="Nuestras sucursales"
        subtitle="Retirá tu pedido sin costo en cualquiera de nuestras tiendas."
      />

      <div className="bg-white px-4 py-12 md:px-8 md:py-[60px] lg:px-[72px]">
        <div className="mx-auto max-w-[1296px]">
          {branches.length === 0 ? (
            <EmptyState icon={<IconMapPin className="h-7 w-7" />} title="Sin sucursales cargadas" />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {branches.map((branch) => {
                const info = BRANCH_INFO[branch.id] ?? {};
                const phone = info.phone ?? branch.phone;
                const mapsUrl =
                  info.mapsUrl ??
                  `https://www.google.com/maps/search/${encodeURIComponent(branch.address)}`;

                return (
                  <article key={branch.id} className="rounded-card border border-line bg-white p-6">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-500">
                      <IconMapPin className="h-6 w-6" />
                    </span>

                    <h2 className="mt-5 font-display text-xl font-semibold text-ink">{branch.name}</h2>
                    <p className="mt-1.5 text-base text-ink-soft">{branch.address}</p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      <a
                        href={`tel:${phone}`}
                        className="flex items-center gap-2 rounded-btn bg-surface px-4 py-2.5 font-display text-xs font-semibold text-ink transition-colors hover:bg-surface-2"
                      >
                        <IconPhone className="h-4 w-4" />
                        {phone}
                      </a>
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-btn bg-ink px-4 py-2.5 font-display text-xs font-semibold text-white transition-colors hover:bg-brand-500"
                      >
                        Cómo llegar
                      </a>
                      <Link
                        href={`/productos?branch=${branch.id}`}
                        className="rounded-btn border border-line px-4 py-2.5 font-display text-xs font-semibold text-ink transition-colors hover:border-ink"
                      >
                        Ver su stock
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BranchesPage;
