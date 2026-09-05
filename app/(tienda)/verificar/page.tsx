import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/account/AuthShell";
import { IconCheck, IconMail } from "@/components/ui/icons";
import { apiPost } from "@/lib/store-api";

export const metadata: Metadata = { title: "Confirmar correo" };

interface Props {
  searchParams: Promise<{ token?: string }>;
}

/**
 * Aterrizaje del link del correo. Se canjea el token acá mismo, en el
 * servidor, y se muestra el resultado: es una página que se abre una sola vez
 * desde el mail, no hace falta ni formulario ni estado en el cliente.
 */
const VerifyPage = async ({ searchParams }: Props) => {
  const { token } = await searchParams;

  const result = token
    ? await apiPost("/auth/verify", { token }, null)
    : { ok: false, message: "El link está incompleto." };

  return (
    <AuthShell
      eyebrow="Tu cuenta"
      title={result.ok ? "¡Correo confirmado!" : "No pudimos confirmar el correo"}
      subtitle={
        result.ok
          ? "Listo. Ya podés ver todo tu historial de compras, incluidas las que hiciste en el mostrador."
          : result.message
      }
    >
      <div className="flex flex-col items-center gap-6">
        <span
          className={`grid h-16 w-16 place-items-center rounded-full ${
            result.ok ? "bg-success/10 text-success" : "bg-brand-50 text-brand-500"
          }`}
        >
          {result.ok ? <IconCheck className="h-7 w-7" /> : <IconMail className="h-7 w-7" />}
        </span>

        <Link
          href={result.ok ? "/cuenta" : "/cuenta/perfil"}
          className="flex h-[52px] w-full items-center justify-center rounded-btn bg-ink font-display text-base font-semibold text-white transition-colors hover:bg-brand-500"
        >
          {result.ok ? "Ir a mi cuenta" : "Pedir un link nuevo"}
        </Link>
      </div>
    </AuthShell>
  );
};

export default VerifyPage;
