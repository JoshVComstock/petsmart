import type { Metadata } from "next";
import Link from "next/link";
import { BookingWizard } from "@/components/grooming/BookingWizard";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconArrowRight, IconScissors } from "@/components/ui/icons";
import { getGroomingCatalog } from "@/lib/api";
import { getMyPetsAction } from "@/lib/actions/grooming";

export const metadata: Metadata = { title: "Reservar turno" };

/**
 * Reservar sin salir de la cuenta: el formulario vive dentro del panel, con
 * el sidebar a la vista. La versión de /peluqueria queda para quien todavía
 * no tiene cuenta.
 */
const ReservarPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ servicio?: string }>;
}) => {
  const { servicio } = await searchParams;
  const [catalog, pets] = await Promise.all([getGroomingCatalog(), getMyPetsAction()]);

  if (catalog.packages.length === 0) {
    return (
      <EmptyState
        icon={<IconScissors className="h-7 w-7" />}
        title="No hay servicios disponibles"
        message="Escribinos y coordinamos el turno por WhatsApp."
        actionHref="/sucursales"
        actionLabel="Ver sucursales"
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/cuenta/turnos"
        className="inline-flex w-fit items-center gap-2 font-display text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
      >
        <IconArrowRight className="h-4 w-4 rotate-180" />
        Volver a mis turnos
      </Link>

      <BookingWizard
        catalog={catalog}
        pets={pets}
        initialType={servicio?.toUpperCase() ?? null}
        doneHref="/cuenta/turnos"
      />
    </div>
  );
};

export default ReservarPage;
