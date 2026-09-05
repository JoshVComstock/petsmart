import Link from "next/link";
import type { ReactNode } from "react";
import { IconPaw } from "./icons";

/** Estado vacío: misma tarjeta blanca de 20px que el resto del sistema. */

interface Props {
  icon?: ReactNode;
  title: string;
  message?: string;
  actionHref?: string;
  actionLabel?: string;
}

export const EmptyState = ({ icon, title, message, actionHref, actionLabel }: Props) => (
  <div className="flex flex-col items-center rounded-card border border-line bg-white px-6 py-16 text-center">
    <span className="grid h-16 w-16 place-items-center rounded-full bg-surface text-brand-500">
      {icon ?? <IconPaw className="h-7 w-7" />}
    </span>

    <h3 className="mt-5 font-display text-xl font-semibold text-ink">{title}</h3>
    {message ? <p className="mt-2 max-w-sm text-sm text-ink-soft">{message}</p> : null}

    {actionHref && actionLabel ? (
      <Link
        href={actionHref}
        className="mt-6 inline-flex h-12 items-center rounded-btn bg-ink px-7 font-display text-base font-semibold text-white transition-colors hover:bg-ink/85"
      >
        {actionLabel}
      </Link>
    ) : null}
  </div>
);
