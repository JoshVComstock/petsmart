import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Poppins } from "next/font/google";
import { SITE_URL, STORE } from "@/lib/config";
import "./globals.css";
import { Toaster } from "@/components/ui/Toast";

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

      {/*
        En desarrollo el service worker cachea los chunks de Turbopack y la
        app queda sirviendo código viejo: solo se registra en producción, y
        en dev se desregistra el que haya quedado instalado.
      */}
      <Script id="sw-register" strategy="afterInteractive">
        {process.env.NODE_ENV === "production"
          ? `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js').catch(function(){})}`
          : `if('serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(function(rs){rs.forEach(function(r){r.unregister()})});if(window.caches){caches.keys().then(function(ks){ks.forEach(function(k){caches.delete(k)})})}}`}
      </Script>
    </body>
  </html>
);

export default RootLayout;
