import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/account/AuthShell";
import { getSession } from "@/lib/session";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Ingresar" };

interface Props {
  searchParams: Promise<{ volver?: string }>;
}

const LoginPage = async ({ searchParams }: Props) => {
  const { volver } = await searchParams;

  // Si ya hay sesión no tiene sentido mostrar el formulario.
  if (await getSession()) redirect(volver ?? "/cuenta");

  return (
    <AuthShell
      eyebrow="Tu cuenta"
      title="Entrá a tu cuenta"
      subtitle="Mirá tus pedidos, guardá favoritos y tené tus direcciones listas para el próximo pedido."
      footer={
        <>
          ¿Todavía no tenés cuenta?{" "}
          <Link href="/crear-cuenta" className="font-semibold text-brand-500 hover:underline">
            Creá una en un minuto
          </Link>
        </>
      }
    >
      <LoginForm next={volver ?? "/cuenta"} />

      <p className="mt-5 text-center text-sm">
        <Link href="/recuperar" className="text-ink-soft transition-colors hover:text-brand-500">
          Olvidé mi contraseña
        </Link>
      </p>
    </AuthShell>
  );
};

export default LoginPage;
