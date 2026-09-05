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
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? DEFAULT_BRANCH.whatsapp,
  currency: "Bs",
} as const;

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

export const CONTACT = {
  phone: DEFAULT_BRANCH.phone,
  phoneLabel: `+591 ${DEFAULT_BRANCH.phone}`,
  email: "",
  city: "Cochabamba, Bolivia",
} as const;

export const BRANCH_INFO: Record<number, { mapsUrl?: string; phone?: string }> =
  Object.fromEntries(BRANCHES.map((b) => [b.id, { mapsUrl: b.mapsUrl, phone: b.phone }]));

export const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/ofertas", label: "Ofertas" },
  { href: "/sucursales", label: "Sucursales" },
] as const;

export const PET_TYPES = [
  { label: "Perros", search: "perro", image: "/templateimage/perros.jpeg" },
  { label: "Gatos", search: "gato", image: "/templateimage/gatos.jpeg" },
  { label: "Aves", search: "ave", image: "/templateimage/aves.jpeg" },
  { label: "Peces", search: "pez", image: "/templateimage/peces.jpeg" },
  { label: "Roedores", search: "roedor", image: "/templateimage/roedores.jpeg" },
  { label: "Conejos", search: "conejo", image: "/templateimage/conejos.jpeg" },
] as const;


const CATEGORY_IMAGES: Record<string, string> = {
  accesorios: "/templateimage/accesorios.jpeg",
  alimento: "/templateimage/alimento.jpeg",
  higiene: "/templateimage/higiene.jpeg",
  snacks: "/templateimage/snacks.jpeg",
};

export const categoryImage = (name: string): string | null => {
  const n = name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
  for (const [key, src] of Object.entries(CATEGORY_IMAGES)) {
    if (n === key || n.startsWith(key) || key.startsWith(n)) return src;
  }
  return null;
};

export const PAGE_SIZE = 12;
