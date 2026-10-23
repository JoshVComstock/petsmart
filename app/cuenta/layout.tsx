import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/account/DashboardShell";
import { LogoutButton } from "@/components/account/LogoutButton";
// VERIFICACION DE CORREO EN PAUSA
// import { VerifyBanner } from "@/components/account/VerifyBanner";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Mi cuenta" };

const AccountLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getSession();

  if (!session) redirect("/ingresar?volver=/cuenta");

  return (
    <DashboardShell
      name={session.name}
      email={session.email}
      logout={<LogoutButton />}
      // VERIFICACION DE CORREO EN PAUSA: el aviso pedía el código de 6 dígitos.
      // banner={!session.emailVerified ? <VerifyBanner email={session.email} /> : undefined}
    >
      {children}
    </DashboardShell>
  );
};

export default AccountLayout;
