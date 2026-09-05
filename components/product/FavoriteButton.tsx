"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { IconHeart, IconHeartFilled } from "@/components/ui/icons";
import { toggleFavoriteAction } from "@/lib/actions/account";

/**
 * Corazón de la tarjeta, tal cual el template.
 *
 * Sin sesión manda a ingresar en vez de fallar en silencio. Con sesión pinta
 * el cambio al instante y lo confirma contra el servidor; si el servidor dice
 * que no, vuelve atrás. Nada de useEffect: solo estado local y una transición.
 */

interface Props {
  productId: number;
  productName: string;
  isFavorite: boolean;
  isLoggedIn: boolean;
  className?: string;
}

export const FavoriteButton = ({
  productId,
  productName,
  isFavorite,
  isLoggedIn,
  className = "",
}: Props) => {
  const router = useRouter();
  const [favorite, setFavorite] = useState(isFavorite);
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    if (!isLoggedIn) {
      router.push(`/ingresar?volver=${encodeURIComponent(`/productos/${productId}`)}`);
      return;
    }

    const next = !favorite;
    setFavorite(next);

    startTransition(async () => {
      const result = await toggleFavoriteAction(productId);
      if (!result.ok) setFavorite(!next);
      else setFavorite(result.favorite);
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-pressed={favorite}
      aria-label={favorite ? `Quitar ${productName} de favoritos` : `Guardar ${productName} en favoritos`}
      className={`grid h-9 w-9 place-items-center rounded-full bg-white/95 backdrop-blur transition-colors hover:bg-white disabled:opacity-60 ${className}`}
    >
      {favorite ? (
        <IconHeartFilled className="h-[18px] w-[18px] animate-[pop_0.28s_ease-out] text-brand-500" />
      ) : (
        <IconHeart className="h-[18px] w-[18px] text-ink" />
      )}
    </button>
  );
};
