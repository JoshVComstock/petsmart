import { cache } from "react";
import { API_URL } from "./config";
import { getSessionToken } from "./session";

/**
 * Llamadas al API que requieren la sesión del cliente.
 *
 * Se usan solo desde el servidor (Server Components y Server Actions): el
 * token sale de la cookie httpOnly y nunca llega al navegador.
 */

interface ApiResult<T> {
  ok: boolean;
  status: number;
  message: string;
  data: T | null;
}

const request = async <T>(
  path: string,
  init: RequestInit = {},
  token?: string | null
): Promise<ApiResult<T>> => {
  const sessionToken = token !== undefined ? token : await getSessionToken();

  try {
    const res = await fetch(`${API_URL}/ecommerce${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        ...init.headers,
      },
      cache: "no-store",
    });

    const json = (await res.json().catch(() => null)) as
      | { message?: string; data?: T }
      | null;

    return {
      ok: res.ok,
      status: res.status,
      message: json?.message ?? (res.ok ? "" : "No pudimos completar la operación"),
      data: json?.data ?? null,
    };
  } catch {
    return {
      ok: false,
      status: 0,
      message: "No pudimos conectar con el servidor. Probá de nuevo.",
      data: null,
    };
  }
};

export const apiGet = <T>(path: string) => request<T>(path);

export const apiPost = <T>(path: string, body?: unknown, token?: string | null) =>
  request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }, token);

export const apiPatch = <T>(path: string, body: unknown) =>
  request<T>(path, { method: "PATCH", body: JSON.stringify(body) });

export const apiDelete = <T>(path: string) => request<T>(path, { method: "DELETE" });

/**
 * Ids de los productos favoritos (vacío si no hay sesión).
 *
 * Va envuelto en `cache` a propósito: cada tarjeta del catálogo lo pide para
 * pintar su corazón, y así todas comparten una sola llamada por render.
 */
export const getFavoriteIds = cache(async (): Promise<number[]> => {
  const token = await getSessionToken();
  if (!token) return [];

  const result = await apiGet<number[]>("/account/favorites/ids");
  return result.data ?? [];
});
