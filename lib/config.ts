/** Configuración de la tienda. Todo lo editable en un solo lugar. */

/**
 * Sucursales (id = id en el backend). Petsmart es la PREDETERMINADA:
 * su teléfono/WhatsApp es el que se muestra en header, topbar y footer.
 */
export const BRANCHES = [
  {
    id: 1,
    name: "Pet Smart",
    phone: "72246327",
    whatsapp: "59172246327",
    mapsUrl: "https://maps.app.goo.gl/h7vhHKhWYkjzsU2n9",
    isDefault: true,
  },
  {
    id: 2,
    name: "Petshop Pepe",
    phone: "64838011",
    whatsapp: "59164838011",
    mapsUrl: "https://maps.app.goo.gl/eXVtZ3Zubik4C3g4A",
    isDefault: false,
  },
] as const;

export const DEFAULT_BRANCH = BRANCHES.find((b) => b.isDefault) ?? BRANCHES[0];

export const STORE = {
  name: "PET SMART",
  tagline: "Premium Sanctuary",
  description:
    "Todo para el cuidado de tu mascota: alimento, accesorios y bienestar, con retiro en tienda o delivery.",
  /** WhatsApp que recibe los pedidos (formato internacional, sin +). Por defecto Petsmart. */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? DEFAULT_BRANCH.whatsapp,
  currency: "Bs",
} as const;

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

/** Contacto visible (barra superior y footer). Predeterminado: Petsmart. */
export const CONTACT = {
  phone: DEFAULT_BRANCH.phone,
  phoneLabel: `+591 ${DEFAULT_BRANCH.phone}`,
  email: "",
  city: "Cochabamba, Bolivia",
} as const;

/** Info por sucursal para la página de sucursales (mapa + teléfono). */
export const BRANCH_INFO: Record<number, { mapsUrl?: string; phone?: string }> =
  Object.fromEntries(BRANCHES.map((b) => [b.id, { mapsUrl: b.mapsUrl, phone: b.phone }]));

/** Navegación principal (superior en desktop) */
export const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/ofertas", label: "Ofertas" },
  { href: "/sucursales", label: "Sucursales" },
] as const;

export const PET_TYPES = [
  { label: "Perros", search: "perro", image: "/templateimage/perros.jfif" },
  { label: "Gatos", search: "gato", image: "/templateimage/gatos.jfif" },
  { label: "Aves", search: "ave", image: "/templateimage/aves.jfif" },
  { label: "Peces", search: "pez", image: "/templateimage/peces.jfif" },
  { label: "Roedores", search: "roedor", image: "/templateimage/roedores.jfif" },
  { label: "Conejos", search: "conejo", image: "/templateimage/conejos.jfif" },
] as const;


const CATEGORY_IMAGES: Record<string, string> = {
  accesorios: "/templateimage/accesorios.jfif",
  alimento: "/templateimage/alimento.jfif",
  higiene: "/templateimage/higiene.jfif",
  snacks: "/templateimage/snacks.jfif",
};

export const categoryImage = (name: string): string | null => {
  const n = name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
  for (const [key, src] of Object.entries(CATEGORY_IMAGES)) {
    if (n === key || n.startsWith(key) || key.startsWith(n)) return src;
  }
  return null;
};

/** Cuántos productos entran por página en el catálogo */
export const PAGE_SIZE = 12;
