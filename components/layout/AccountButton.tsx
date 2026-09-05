import Link from "next/link";
import { IconUser } from "@/components/ui/icons";
import { getSession } from "@/lib/session";

/**
 * Acceso a la cuenta en el header. Sin sesión lleva a ingresar; con sesión
 * muestra la inicial y entra al área de cuenta.
 */

export const AccountButton = async () => {
  const session = await getSession();

  if (!session) {
    return (
      <Link
        href="/ingresar"
        aria-label="Ingresar a mi cuenta"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink transition-colors hover:bg-surface"
      >
        <IconUser className="h-6 w-6" />
      </Link>
    );
  }

  return (
    <Link
      href="/cuenta"
      aria-label={`Mi cuenta, ${session.name}`}
      title={session.name}
      className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink font-display text-sm font-semibold uppercase text-white transition-colors hover:bg-brand-500"
    >
      {session.name.charAt(0)}
      {/* Punto naranja mientras el correo no esté confirmado */}
      {!session.emailVerified ? (
        <span
          aria-hidden
          className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-white bg-brand-500"
        />
      ) : null}
    </Link>
  );
};
