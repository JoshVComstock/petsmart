import Image from "next/image";
import Link from "next/link";
import { STORE } from "@/lib/config";

/**
 * Marca de la tienda. Siempre imagen, nunca texto:
 *  - logo.png      logotipo completo (desktop)
 *  - logo-icon.png solo el ícono (mobile, footer chico)
 */

interface Props {
  /** Solo el ícono, sin el logotipo completo (mobile o espacios chicos) */
  iconOnly?: boolean;
  className?: string;
}

export const Logo = ({ iconOnly = false, className = "" }: Props) => (
  <Link href="/" aria-label={STORE.name} className={`flex shrink-0 items-center ${className}`}>
    {iconOnly ? (
      <Image
        src="/logo-icon.png"
        alt={STORE.name}
        width={56}
        height={56}
        priority
        className="h-10 w-10 object-contain"
      />
    ) : (
      <Image
        src="/logo.png"
        alt={STORE.name}
        width={260}
        height={64}
        priority
        className="h-11 w-auto object-contain"
      />
    )}
  </Link>
);
