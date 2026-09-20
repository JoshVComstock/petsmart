"use server";

import { revalidatePath } from "next/cache";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/store-api";
import type { Availability, Pet } from "@/lib/types";
import { field, type FormState } from "./types";

export const getMyPetsAction = async (): Promise<Pet[]> => {
  const result = await apiGet<Pet[]>("/account/pets");
  return result.data ?? [];
};

export const getAvailabilityAction = async (date: string): Promise<Availability> => {
  const result = await apiGet<Availability>(`/grooming/availability?date=${date}`);
  return result.data ?? { date, slots: [] };
};

const petPayload = (form: FormData) => ({
  name: field(form, "name"),
  breed: field(form, "breed") || undefined,
  size: field(form, "size") || undefined,
  species: field(form, "species") || undefined,
  sex: field(form, "sex") || undefined,
  birthDate: field(form, "birthDate") || undefined,
  weightKg: field(form, "weightKg") || undefined,
  isNeutered: form.get("isNeutered") === "on" ? true : undefined,
  activity: field(form, "activity") || undefined,
  bodyCondition: field(form, "bodyCondition") || undefined,
  allergies: field(form, "allergies") || undefined,
  healthNotes: field(form, "healthNotes") || undefined,
  dietNotes: field(form, "dietNotes") || undefined,
  description: field(form, "description") || undefined,
});

const revalidatePets = () => {
  revalidatePath("/cuenta/mascotas");
  revalidatePath("/peluqueria/reservar");
};

export const savePetAction = async (
  _prev: FormState,
  form: FormData
): Promise<FormState> => {
  const payload = petPayload(form);
  if (!payload.name) return { ok: false, message: "El nombre de la mascota es obligatorio" };

  const id = Number(form.get("id"));
  const result = id
    ? await apiPatch(`/account/pets/${id}`, payload)
    : await apiPost("/account/pets", payload);

  if (result.ok) revalidatePets();

  return { ok: result.ok, message: result.message };
};

export const deletePetAction = async (
  _prev: FormState,
  form: FormData
): Promise<FormState> => {
  const id = Number(form.get("id"));
  if (!id) return { ok: false, message: "Mascota inválida" };

  const result = await apiDelete(`/account/pets/${id}`);

  if (result.ok) revalidatePets();

  return { ok: result.ok, message: result.message };
};

export const bookAppointmentAction = async (
  _prev: FormState,
  form: FormData
): Promise<FormState> => {
  const petId = Number(form.get("petId"));
  const serviceId = Number(form.get("serviceId"));
  const startsAt = field(form, "startsAt");

  if (!petId) return { ok: false, message: "Elegí una mascota" };
  if (!serviceId) return { ok: false, message: "Elegí el servicio y el tamaño" };
  if (!startsAt) return { ok: false, message: "Elegí día y hora" };

  const extraIds = form
    .getAll("extraIds")
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value > 0);

  const result = await apiPost("/grooming/appointments", {
    petId,
    serviceId,
    startsAt,
    extraIds,
    notes: field(form, "notes") || undefined,
  });

  if (result.ok) {
    revalidatePath("/cuenta/turnos");
    revalidatePath("/peluqueria/reservar");
  }

  return { ok: result.ok, message: result.message };
};

export const cancelAppointmentAction = async (
  _prev: FormState,
  form: FormData
): Promise<FormState> => {
  const id = Number(form.get("id"));
  if (!id) return { ok: false, message: "Turno inválido" };

  const result = await apiPatch(`/account/appointments/${id}/cancel`, {});

  if (result.ok) revalidatePath("/cuenta/turnos");

  return { ok: result.ok, message: result.message };
};
