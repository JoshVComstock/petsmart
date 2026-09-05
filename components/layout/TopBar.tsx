import Link from "next/link";
import {
  IconMapPin,
  IconShield,
  IconStore,
  IconTruck,
  IconWhatsApp,
} from "@/components/ui/icons";
import { BRANCHES, CONTACT, STORE } from "@/lib/config";

const PERKS = [
  { Icon: IconTruck, text: "Delivery a domicilio" },
  { Icon: IconStore, text: "Retiro en tienda" },
  { Icon: IconShield, text: "Stock real" },
] as const;

export const TopBar = () => (
  <div className="border-b border-line bg-surface">
    <div className="px-4 md:px-8 lg:px-[72px]">
      <div className="mx-auto flex max-w-[1296px] items-center justify-between gap-4 py-2.5 md:py-3">
        <a
          href={`https://wa.me/${STORE.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="flex shrink-0 items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-brand-600"
        >
          <IconWhatsApp className="h-4 w-4 shrink-0 text-whatsapp" />
          {CONTACT.phoneLabel}
        </a>

        <ul className="hidden items-center gap-6 text-sm text-ink-body lg:flex xl:gap-8">
          {PERKS.map(({ Icon, text }) => (
            <li key={text} className="flex items-center gap-2">
              <Icon className="h-4 w-4 shrink-0 text-brand-500" />
              {text}
            </li>
          ))}
        </ul>

        <div className="hidden shrink-0 items-center gap-4 sm:flex md:gap-6">
          {BRANCHES.map((branch) => (
            <a
              key={branch.id}
              href={branch.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm text-ink transition-colors hover:text-brand-600"
            >
              <IconMapPin className="h-4 w-4 shrink-0 text-brand-500" />
              {branch.name}
            </a>
          ))}
        </div>

        <Link
          href="/sucursales"
          className="flex shrink-0 items-center gap-1.5 text-sm text-ink transition-colors hover:text-brand-600 sm:hidden"
        >
          <IconMapPin className="h-4 w-4 shrink-0 text-brand-500" />
          Sucursales
        </Link>
      </div>
    </div>
  </div>
);
