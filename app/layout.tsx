import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import CookieBanner from "@/components/CookieBanner";
import { ToastProvider } from "@/components/ToastProvider";
import { getSiteUrl } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

export const viewport: Viewport = {
  themeColor: "#0b0f19",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ObraClick | Software de Gestión de Obras, Reformas y Construcción",
    template: "%s | ObraClick",
  },
  description:
    "El software en la nube #1 para constructoras, arquitectos y empresas de reformas. Partes diarios digitales, control presupuestario en tiempo real, cronograma de hitos y certificaciones automáticas.",
  applicationName: "ObraClick",
  authors: [{ name: "ObraClick", url: siteUrl }],
  generator: "Next.js",
  keywords: [
    "software gestion obras",
    "programa control de obras",
    "app para obras y reformas",
    "software construccion españa",
    "diario de obra digital",
    "control de costes construccion",
    "software para arquitectos y aparejadores",
    "app jefes de obra",
    "programa reformas integrales",
    "certificaciones de obra pdf",
    "control de subcontratas y cuadrillas",
    "software mediciones y presupuestos",
    "seguimiento fotografico de obra",
    "libro de ordenes digital",
    "plataforma gestion proyectos construccion",
  ],
  creator: "ObraClick",
  publisher: "ObraClick",
  category: "business",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ObraClick",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "es-ES": "/",
      es: "/",
    },
  },
  openGraph: {
    title: "ObraClick | El Software #1 de Control y Gestión de Obras",
    description:
      "Controla tus obras y reformas en tiempo real: partes diarios digitales con fotos, control de gastos sin desviaciones, seguimiento de hitos y certificaciones en 1 click.",
    url: siteUrl,
    siteName: "ObraClick",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ObraClick | Software de Gestión y Control de Obras",
    description:
      "Ahorra hasta 18h semanales y elimina desvíos presupuestarios en tus obras. Pruébalo gratis sin tarjeta.",
    creator: "@obraclick",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ObraClick",
  alternateName: "ObraClick Software",
  url: siteUrl,
  logo: `${siteUrl}/favicon.ico`,
  description:
    "Solución integral de software en la nube para constructoras, arquitectos y empresas de reformas en España y Latinoamérica.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "soporte@obraclick.es",
    availableLanguage: ["Spanish", "English"],
  },
};

const jsonLdSoftwareApp = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ObraClick",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, iOS, Android, macOS, Windows",
  softwareVersion: "2.0",
  description:
    "Software para gestión y control integral de obras y reformas: partes diarios, desviaciones presupuestarias, certificaciones e incidencias.",
  // Sin aggregateRating: valoraciones inventadas en datos estructurados incumplen las
  // directrices de Google y pueden ser consideradas publicidad engañosa. Añádelo solo
  // cuando tengas reseñas reales y verificables.
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      name: "Plan Gratuito",
      description: "1 obra activa para siempre con partes diarios e hitos",
    },
    {
      "@type": "Offer",
      price: "79",
      priceCurrency: "EUR",
      name: "Constructoras Pro",
      description: "Obras activas ilimitadas, certificaciones con firma y control de cuadrillas",
    },
  ],
  featureList: [
    "Diario de obra digital con fotos geolocalizadas",
    "Control de presupuestos y desviaciones en tiempo real",
    "Cronograma de hitos y planificación Gantt",
    "Registro y asignación de incidencias",
    "Certificaciones automáticas en PDF",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdOrganization),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdSoftwareApp),
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <ToastProvider>
            {children}
            <CookieBanner />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
