import type { Pet, PetSpecies } from "./types";

export const SPECIES_LABELS: Record<PetSpecies, string> = {
  DOG: "Perro",
  CAT: "Gato",
  BIRD: "Ave",
  FISH: "Pez",
  RODENT: "Roedor",
  RABBIT: "Conejo",
  REPTILE: "Reptil",
  OTHER: "Otro",
};

export const SEX_LABELS: Record<"MALE" | "FEMALE" | "UNKNOWN", string> = {
  MALE: "Macho",
  FEMALE: "Hembra",
  UNKNOWN: "Sin especificar",
};

export const ACTIVITY_LABELS: Record<"LOW" | "MODERATE" | "HIGH", string> = {
  LOW: "Tranquilo",
  MODERATE: "Normal",
  HIGH: "Muy activo",
};

export const CONDITION_LABELS: Record<"UNDERWEIGHT" | "IDEAL" | "OVERWEIGHT", string> = {
  UNDERWEIGHT: "Bajo peso",
  IDEAL: "Ideal",
  OVERWEIGHT: "Sobrepeso",
};

export const SPECIES_OPTIONS = (Object.keys(SPECIES_LABELS) as PetSpecies[]).map((value) => ({
  value,
  label: SPECIES_LABELS[value],
}));

/**
 * Edad en palabras. Hasta el año va en meses, que es como la gente la dice;
 * de ahí en más solo los años, para que entre en una línea del carnet.
 */
export const ageLabel = (months: number | null): string | null => {
  if (months === null) return null;
  if (months < 1) return "Recién nacido";
  if (months < 12) return `${months} ${months === 1 ? "mes" : "meses"}`;

  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? "año" : "años"}`;
};

/** Número de socio: estable, legible y del mismo largo para todos. */
export const memberCode = (id: number): string => String(id).padStart(5, "0");

/** Resumen de una línea para listas y encabezados. */
export const petSummary = (pet: Pet, sizeLabels: Record<string, string>): string =>
  [
    pet.species ? SPECIES_LABELS[pet.species] : null,
    pet.breed,
    pet.size ? sizeLabels[pet.size] : null,
    ageLabel(pet.ageMonths),
  ]
    .filter(Boolean)
    .join(" · ") || "Sin datos todavía";
