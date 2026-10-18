"use client";

import { useSyncExternalStore } from "react";

/**
 * Mantiene la app al día sola.
 *
 * El service worker ya trae lo nuevo apenas se recarga, pero si alguien deja
 * la pestaña abierta nunca vuelve a preguntar y se queda con la versión de
 * ayer. Acá se le pregunta cada tanto y al volver a la pestaña; cuando el
 * worker nuevo toma el control, se recarga una sola vez.
 *
 * `updateViaCache: "none"` es clave: sin eso el navegador puede servir el
 * propio sw.js desde su caché y nunca enterarse del deploy.
 */

const CADA = 2 * 60 * 1000;

let arrancado = false;

const arrancar = () => {
  if (arrancado || typeof window === "undefined") return () => {};
  if (!("serviceWorker" in navigator)) return () => {};
  arrancado = true;

  const dev = process.env.NODE_ENV !== "production";

  if (dev) {
    navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister()));
    if (window.caches) caches.keys().then((ks) => ks.forEach((k) => caches.delete(k)));
    return () => {};
  }

  let recargando = false;

  const recargarUnaVez = () => {
    if (recargando) return;
    recargando = true;
    window.location.reload();
  };

  navigator.serviceWorker.addEventListener("controllerchange", recargarUnaVez);

  // Un chunk que ya no existe significa que el deploy cambió debajo de los pies.
  window.addEventListener("error", (evento) => {
    const mensaje = String((evento as ErrorEvent).message ?? "");
    if (/ChunkLoadError|Loading chunk|dynamically imported module/i.test(mensaje)) {
      recargarUnaVez();
    }
  });

  navigator.serviceWorker
    .register("/sw.js", { updateViaCache: "none" })
    .then((registro) => {
      const revisar = () => {
        if (document.visibilityState === "visible") registro.update().catch(() => {});
      };

      setInterval(revisar, CADA);
      document.addEventListener("visibilitychange", revisar);
      window.addEventListener("online", revisar);
      revisar();
    })
    .catch(() => {});

  return () => {};
};

const sinCambios = () => false;

export const AutoUpdate = () => {
  useSyncExternalStore(arrancar, sinCambios, sinCambios);
  return null;
};
