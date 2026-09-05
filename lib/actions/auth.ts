"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiPost } from "@/lib/store-api";
import { clearSessionCookie, setSessionCookie } from "@/lib/session";
import { field, type FormState } from "./types";
import type { StoreClient } from "@/lib/types";

/**
 * Acciones de cuenta. Corren en el servidor de Next: reciben el formulario,
 * hablan con el API de Express y guardan el JWT en la cookie httpOnly.
 * Los formularios las consumen con useActionState, así no hace falta ningún
 * fetch en el cliente ni ningún useEffect.
 */

interface SessionResponse {
  token: string;
  client: StoreClient;
  emailSent?: boolean;
}

/** Destino seguro después de entrar: solo rutas internas, nunca un dominio externo. */
const safeNext = (value: string): string =>
  value.startsWith("/") && !value.startsWith("//") ? value : "/cuenta";

export const loginAction = async (_prev: FormState, form: FormData): Promise<FormState> => {
  const email = field(form, "email");
  const password = String(form.get("password") ?? "");

  if (!email || !password) {
    return { ok: false, message: "Completá tu correo y contraseña" };
  }

  const result = await apiPost<SessionResponse>("/auth/login", { email, password }, null);

  if (!result.ok || !result.data) {
    return { ok: false, message: result.message };
  }

  await setSessionCookie(result.data.token);

  // redirect lanza una señal interna de Next: va fuera de cualquier try/catch.
  redirect(safeNext(field(form, "next")));
};

export const registerAction = async (_prev: FormState, form: FormData): Promise<FormState> => {
  const name = field(form, "name");
  const email = field(form, "email");
  const phone = field(form, "phone");
  const password = String(form.get("password") ?? "");
  const repeat = String(form.get("repeat") ?? "");

  if (!name || !email || !phone || !password) {
    return { ok: false, message: "Completá todos los campos" };
  }

  if (password.length < 8) {
    return { ok: false, message: "La contraseña necesita al menos 8 caracteres" };
  }

  if (password !== repeat) {
    return { ok: false, message: "Las contraseñas no coinciden" };
  }

  const result = await apiPost<SessionResponse>(
    "/auth/register",
    { name, email, phone, password },
    null
  );

  if (!result.ok || !result.data) {
    return { ok: false, message: result.message };
  }

  await setSessionCookie(result.data.token);

  redirect(safeNext(field(form, "next")));
};

export const logoutAction = async (): Promise<void> => {
  await clearSessionCookie();
  revalidatePath("/", "layout");
  redirect("/");
};

export const forgotPasswordAction = async (
  _prev: FormState,
  form: FormData
): Promise<FormState> => {
  const email = field(form, "email");

  if (!email) return { ok: false, message: "Ingresá tu correo" };

  const result = await apiPost("/auth/forgot-password", { email }, null);

  // El API responde igual exista o no la cuenta, para no filtrar correos.
  return { ok: result.ok, message: result.message };
};

export const resetPasswordAction = async (
  _prev: FormState,
  form: FormData
): Promise<FormState> => {
  const token = field(form, "token");
  const password = String(form.get("password") ?? "");
  const repeat = String(form.get("repeat") ?? "");

  if (!token) return { ok: false, message: "El link está incompleto. Pedí uno nuevo." };
  if (password.length < 8) {
    return { ok: false, message: "La contraseña necesita al menos 8 caracteres" };
  }
  if (password !== repeat) return { ok: false, message: "Las contraseñas no coinciden" };

  const result = await apiPost("/auth/reset-password", { token, password }, null);

  return { ok: result.ok, message: result.message };
};

export const resendVerificationAction = async (): Promise<FormState> => {
  const result = await apiPost("/auth/resend-verification");
  return { ok: result.ok, message: result.message };
};
