import { IconPaw } from "@/components/ui/icons";

/**
 * Imagen de producto con respaldo sobrio cuando no hay foto cargada.
 * Se usa <img> porque las fotos vienen de un backend externo variable.
 */

interface Props {
  src: string | null;
  alt: string;
  className?: string;
}

export const ProductImage = ({ src, alt, className = "" }: Props) => {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-surface text-brand-200 ${className}`}
        role="img"
        aria-label={alt}
      >
        <IconPaw className="h-10 w-10" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading="lazy" className={`bg-surface object-cover ${className}`} />
  );
};
