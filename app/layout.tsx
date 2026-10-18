import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { SITE_URL, STORE } from "@/lib/config";
import "./globals.css";
import { Toaster } from "@/components/ui/Toast";
import { AutoUpdate } from "@/components/layout/AutoUpdate";

// Poppins para títulos, menú y botones; Inter para los textos largos.
// Son las dos familias que usa el diseño.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${STORE.name} — Tienda para mascotas`,
    template: `%s · ${STORE.name}`,
  },
  description: STORE.description,
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: STORE.name,
    locale: "es_BO",
    url: "/",
    title: `${STORE.name} — Tienda para mascotas`,
    description: STORE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${STORE.name} — Tienda para mascotas`,
    description: STORE.description,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: STORE.name,
  },
  // Los íconos los resuelve Next por convención de archivos:
  // app/icon.png (favicon) y app/apple-icon.png (iOS).
};

export const viewport: Viewport = {
  themeColor: "#fd7e14",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="es" className={`${poppins.variable} ${inter.variable} h-full antialiased`}>
    <body className="min-h-full">
      {children}

      <Toaster />

      <AutoUpdate />
    </body>
  </html>
);

export default RootLayout;
