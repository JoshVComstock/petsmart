"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { IconSearch } from "@/components/ui/icons";

/**
 * Buscador del template: píldora gris con el botón circular negro
 * pegado a la derecha. Navega a /productos?search=… y el filtrado
 * ocurre en el servidor.
 *
 * A propósito NO usa useSearchParams: en páginas estáticas obliga a un
 * Suspense que puede quedarse en el fallback. Menos piezas, menos bugs.
 */

export const SearchBar = ({ className = "" }: { className?: string }) => {
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const search = String(new FormData(event.currentTarget).get("search") ?? "").trim();
    router.push(search ? `/productos?search=${encodeURIComponent(search)}` : "/productos");
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className={`flex h-10 items-center gap-2 rounded-[20px] bg-surface pl-4 pr-[5px] ${className}`}
    >
      <input
        name="search"
        type="search"
        aria-label="Buscar productos"
        placeholder="Buscar productos..."
        className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft md:text-base"
      />
      <button
        type="submit"
        aria-label="Buscar"
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-white transition-colors hover:bg-brand-500"
      >
        <IconSearch className="h-5 w-5" />
      </button>
    </form>
  );
};
