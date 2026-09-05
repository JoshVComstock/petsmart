import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/account/DashboardShell";
import { LogoutButton } from "@/components/account/LogoutButton";
import { VerifyBanner } from "@/components/account/VerifyBanner";
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
      banner={!session.emailVerified ? <VerifyBanner email={session.email} /> : undefined}
    >
      {children}
    </DashboardShell>
  );
};

export default AccountLayout;
