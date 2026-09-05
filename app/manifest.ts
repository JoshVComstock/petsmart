import type { MetadataRoute } from "next";
import { STORE } from "@/lib/config";

/** Manifest de la PWA: permite instalar la tienda como app. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${STORE.name} — Tienda para mascotas`,
    short_name: STORE.name,
    description: STORE.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fffbf8",
    theme_color: "#f4792b",
    lang: "es",
    categories: ["shopping", "lifestyle"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Productos", url: "/productos" },
      { name: "Ofertas", url: "/ofertas" },
      { name: "Mi carrito", url: "/carrito" },
    ],
  };
}
