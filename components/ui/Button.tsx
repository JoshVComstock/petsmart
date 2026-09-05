import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Botón del template: negro, esquinas de 12px y Poppins semibold.
 * Renderiza <Link> si recibe href y <button> si recibe onClick,
 * así el mismo estilo sirve para navegar y para accionar.
 */

type Variant = "primary" | "brand" | "outline" | "whatsapp";
type Size = "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-ink/85",
  brand: "bg-brand-500 text-white hover:bg-brand-600",
  outline: "border border-line bg-white text-ink hover:border-ink",
  whatsapp: "bg-whatsapp text-white hover:opacity-90",
};

const SIZES: Record<Size, string> = {
  md: "h-12 px-7 text-base",
  lg: "h-[52px] px-8 text-base md:h-[60px] md:px-10 md:text-xl",
};

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}

type Props = BaseProps &
  (
    | { href: string; onClick?: never; type?: never; disabled?: never }
    | { href?: never; onClick?: () => void; type?: "button" | "submit"; disabled?: boolean }
  );

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  href,
  onClick,
  type = "button",
  disabled,
}: Props) => {
  const styles = `inline-flex shrink-0 items-center justify-center gap-2.5 rounded-btn font-display font-semibold transition-colors duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={styles}>
      {children}
    </button>
  );
};
