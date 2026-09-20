import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { BookingWizard } from "@/components/grooming/BookingWizard";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconScissors } from "@/components/ui/icons";
import { getGroomingCatalog } from "@/lib/api";
import { getMyPetsAction } from "@/lib/actions/grooming";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Reservar turno" };

const BookingPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ servicio?: string }>;
}) => {
  const session = await getSession();
  if (!session) redirect("/ingresar?volver=/peluqueria/reservar");

  const { servicio } = await searchParams;
  const [catalog, pets] = await Promise.all([getGroomingCatalog(), getMyPetsAction()]);

  return (
    <>
      <PageHero
        eyebrow="Peluquería"
        title="Reservá tu turno"
        subtitle="Elegí el servicio, tu mascota y el horario que mejor te quede."
      />

      <section className="bg-white px-4 py-10 md:px-8 md:py-14 lg:px-[72px]">
        <div className="mx-auto max-w-[1296px]">
          {catalog.packages.length === 0 ? (
            <EmptyState
              icon={<IconScissors className="h-7 w-7" />}
              title="No hay servicios disponibles"
              message="Escribinos y coordinamos el turno por WhatsApp."
              actionHref="/sucursales"
              actionLabel="Ver sucursales"
            />
          ) : (
            <BookingWizard
              catalog={catalog}
              pets={pets}
              initialType={servicio?.toUpperCase() ?? null}
            />
          )}

          <p className="mt-8 text-center text-sm text-ink-soft">
            ¿Preferís coordinar por otro medio?{" "}
            <Link href="/sucursales" className="font-semibold text-brand-500">
              Mirá nuestras sucursales
            </Link>
          </p>
        </div>
      </section>
    </>
  );
};

export default BookingPage;
