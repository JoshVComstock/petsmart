"use client";

import { useTransition } from "react";
import { IconLogout } from "@/components/ui/icons";
import { logoutAction } from "@/lib/actions/auth";

/** Cierra la sesión: borra la cookie en el servidor y vuelve al inicio. */

export const LogoutButton = () => {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => logoutAction())}
      className="flex items-center gap-3 rounded-btn px-4 py-3 font-display text-sm font-semibold text-ink-soft transition-colors hover:bg-surface-2 hover:text-danger disabled:opacity-60"
    >
      <IconLogout className="h-5 w-5 shrink-0" />
      {pending ? "Saliendo…" : "Cerrar sesión"}
    </button>
  );
};
