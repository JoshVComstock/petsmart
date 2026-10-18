import type { Metadata } from "next";
import { AuthShell } from "@/components/account/AuthShell";
import { ResetForm } from "./ResetForm";

export const metadata: Metadata = { title: "Nueva contraseña" };

interface Props {
  searchParams: Promise<{ token?: string }>;
}

const ResetPage = async ({ searchParams }: Props) => {
  const { token } = await searchParams;

  return (
    <AuthShell
      eyebrow="Tu cuenta"
      title="Elegí una contraseña nueva"
      subtitle="Después de guardarla vas a poder entrar con ella."
    >
      <ResetForm token={token ?? ""} />
    </AuthShell>
  );
};

export default ResetPage;
