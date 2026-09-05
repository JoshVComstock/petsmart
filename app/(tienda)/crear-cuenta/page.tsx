import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/account/AuthShell";
import { getSession } from "@/lib/session";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = { title: "Crear cuenta" };

interface Props {
  searchParams: Promise<{ volver?: string }>;
}

const RegisterPage = async ({ searchParams }: Props) => {
  const { volver } = await searchParams;

  if (await getSession()) redirect(volver ?? "/cuenta");

  return (
    <AuthShell
      eyebrow="Tu cuenta"
      title="Creá tu cuenta"
      subtitle="Te mandamos un correo para confirmarla, pero podés empezar a comprar enseguida."
      footer={
        <>
          ¿Ya tenés cuenta?{" "}
          <Link href="/ingresar" className="font-semibold text-brand-500 hover:underline">
            Entrá acá
          </Link>
        </>
      }
    >
      <RegisterForm next={volver ?? "/cuenta"} />
    </AuthShell>
  );
};

export default RegisterPage;
