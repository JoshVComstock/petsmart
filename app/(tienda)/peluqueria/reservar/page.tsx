import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { GuestBooking } from "@/components/grooming/GuestBooking";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconScissors } from "@/components/ui/icons";
import { getGroomingCatalog } from "@/lib/api";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Reservar turno" };

/**
 * Turno para quien no tiene cuenta. Si hay sesión no tiene sentido pedir los
 * datos de nuevo: se va al panel, donde además se elige el horario exacto.
 */
const BookingPage = async () => {
  const session = await getSession();
  if (session) redirect("/cuenta/turnos/reservar");

  const catalog = await getGroomingCatalog();

  return (
    <>
      <PageHero
        eyebrow="Peluquería"
        title="Pedí tu turno"
        subtitle="Contanos qué necesita tu mascota y coordinamos el horario por WhatsApp."
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
            <GuestBooking catalog={catalog} />
          )}

          <p className="mt-8 text-center text-sm text-ink-soft">
            ¿Ya tenés cuenta?{" "}
            <Link href="/ingresar?volver=/cuenta/turnos/reservar" className="font-semibold text-brand-500">
              Entrá y elegí el horario
            </Link>
          </p>
        </div>
      </section>
    </>
  );
};

export default BookingPage;
