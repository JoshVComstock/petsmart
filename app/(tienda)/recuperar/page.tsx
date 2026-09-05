import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/account/AuthShell";
import { ForgotForm } from "./ForgotForm";

export const metadata: Metadata = { title: "Recuperar contraseña" };

const ForgotPage = () => (
  <AuthShell
    eyebrow="Tu cuenta"
    title="¿Olvidaste tu contraseña?"
    subtitle="Poné tu correo y te mandamos un link para elegir una nueva. Vence en una hora."
    footer={
      <Link href="/ingresar" className="font-semibold text-brand-500 hover:underline">
        Volver a ingresar
      </Link>
    }
  >
    <ForgotForm />
  </AuthShell>
);

export default ForgotPage;
