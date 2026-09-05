"use server";

import { revalidatePath } from "next/cache";
import { apiDelete, apiPatch, apiPost } from "@/lib/store-api";
import { field, type FormState } from "./types";

/** Acciones del área de cuenta: perfil, contraseña, direcciones y favoritos. */

export const updateProfileAction = async (
  _prev: FormState,
  form: FormData
): Promise<FormState> => {
  const name = field(form, "name");
  const phone = field(form, "phone");

  if (!name || !phone) return { ok: false, message: "El nombre y el teléfono no pueden ir vacíos" };

  const result = await apiPatch("/auth/me", { name, phone, ci: field(form, "ci") });

  if (result.ok) revalidatePath("/cuenta", "layout");

  return { ok: result.ok, message: result.message };
};

export const changePasswordAction = async (
  _prev: FormState,
  form: FormData
): Promise<FormState> => {
  const currentPassword = String(form.get("currentPassword") ?? "");
  const newPassword = String(form.get("newPassword") ?? "");
  const repeat = String(form.get("repeat") ?? "");

  if (!currentPassword || !newPassword) {
    return { ok: false, message: "Completá la contraseña actual y la nueva" };
  }
  if (newPassword.length < 8) {
    return { ok: false, message: "La contraseña necesita al menos 8 caracteres" };
  }
  if (newPassword !== repeat) return { ok: false, message: "Las contraseñas no coinciden" };

  const result = await apiPost("/auth/change-password", { currentPassword, newPassword });

  return { ok: result.ok, message: result.message };
};

export const saveAddressAction = async (
  _prev: FormState,
  form: FormData
): Promise<FormState> => {
  const id = field(form, "id");
  const body = {
    label: field(form, "label"),
    address: field(form, "address"),
    reference: field(form, "reference"),
    mapsUrl: field(form, "mapsUrl"),
    isDefault: form.get("isDefault") === "on",
  };

  if (!body.label || !body.address) {
    return { ok: false, message: "Poné un nombre y la dirección" };
  }

  // Con id edita, sin id crea. Un solo formulario para los dos casos.
  const result = id
    ? await apiPatch(`/account/addresses/${id}`, body)
    : await apiPost("/account/addresses", body);

  if (result.ok) revalidatePath("/cuenta/ubicaciones");

  return { ok: result.ok, message: result.message };
};

export const deleteAddressAction = async (id: number): Promise<FormState> => {
  const result = await apiDelete(`/account/addresses/${id}`);

  if (result.ok) revalidatePath("/cuenta/ubicaciones");

  return { ok: result.ok, message: result.message };
};

/**
 * Alterna un favorito. Devuelve el estado nuevo para que el corazón lo
 * confirme; la tarjeta ya lo mostró de forma optimista.
 */
export const toggleFavoriteAction = async (
  productId: number
): Promise<{ ok: boolean; favorite: boolean; message: string }> => {
  const result = await apiPost<{ productId: number; favorite: boolean }>(
    `/account/favorites/${productId}`
  );

  if (result.ok) revalidatePath("/cuenta/favoritos");

  return {
    ok: result.ok,
    favorite: result.data?.favorite ?? false,
    message: result.message,
  };
};
