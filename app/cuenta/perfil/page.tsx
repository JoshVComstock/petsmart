import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PasswordForm, ProfileForm } from "@/components/account/ProfileForms";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Mis datos" };

const ProfilePage = async () => {
  const client = await getSession();

  // El layout ya redirige, pero TypeScript necesita el guard.
  if (!client) redirect("/ingresar?volver=/cuenta/perfil");

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="font-display text-2xl font-semibold text-ink">Mis datos</h2>
        <p className="mt-1.5 text-base text-ink-soft">
          Con estos datos armamos el pedido que se manda por WhatsApp.
        </p>
      </header>

      <ProfileForm client={client} />
      <PasswordForm />
    </div>
  );
};

export default ProfilePage;
