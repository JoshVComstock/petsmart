import { cookies } from "next/headers";
import { cache } from "react";
import { API_URL } from "./config";
import type { StoreClient } from "./types";

/**
 * Sesión del cliente.
 *
 * El JWT vive en una cookie httpOnly que solo lee el servidor de Next: el
 * navegador nunca lo ve, así que un XSS no se lo puede llevar. Los Server
 * Components y las Server Actions lo leen de acá y lo mandan al API de Express
 * en el header Authorization.
 */

export const SESSION_COOKIE = "petsmart_session";

/** 30 días, igual que la expiración del token que firma el server. */
const MAX_AGE = 60 * 60 * 24 * 30;

export const setSessionCookie = async (token: string) => {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
};

export const clearSessionCookie = async () => {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
};

export const getSessionToken = async (): Promise<string | null> => {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
};

/**
 * Devuelve el cliente logueado, o null.
 * Va envuelto en `cache` para que varios componentes del mismo render
 * compartan una sola llamada a /auth/me.
 */
export const getSession = cache(async (): Promise<StoreClient | null> => {
  const token = await getSessionToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/ecommerce/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      // Datos de sesión: nunca cacheados.
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json = (await res.json()) as { data: StoreClient | null };
    return json.data;
  } catch {
    // Si el API está caído la tienda sigue navegable como invitado.
    return null;
  }
});
