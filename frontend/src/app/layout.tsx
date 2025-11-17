import type { Metadata } from "next";
import "./globals.css";
import 'leaflet/dist/leaflet.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://pura-pata.com'),
  title: {
    default: "Pura Pata - Adopción de Perros en Costa Rica",
    template: "%s | Pura Pata"
  },
  description: "Encuentra tu mejor amigo en Costa Rica. Plataforma de adopción responsable de perros. Miles de perros rescatados esperando un hogar amoroso. Adopta, no compres.",
  keywords: [
    'adopción de perros',
    'adoptar perro Costa Rica',
    'perros en adopción',
    'refugio de perros',
    'rescate animal Costa Rica',
    'adopción responsable',
    'perros San José',
    'perros Alajuela',
    'perros Cartago',
    'perros Heredia',
    'mascotas en adopción',
    'adoptar cachorro',
    'perros rescatados',
    'Pura Pata'
  ],
  authors: [{ name: 'Pura Pata' }],
  creator: 'Pura Pata',
  publisher: 'Pura Pata',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/logo.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'es_CR',
    url: 'https://pura-pata.com',
    siteName: 'Pura Pata',
    title: 'Pura Pata - Adopción de Perros en Costa Rica',
    description: 'Encuentra tu mejor amigo en Costa Rica. Miles de perros rescatados esperando un hogar amoroso. Adopta, no compres.',
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: 'Pura Pata - Adopción de Perros en Costa Rica',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pura Pata - Adopción de Perros en Costa Rica',
    description: 'Encuentra tu mejor amigo en Costa Rica. Miles de perros rescatados esperando un hogar amoroso.',
    images: ['/logo.svg'],
    creator: '@purapata',
  },
  alternates: {
    canonical: 'https://pura-pata.com',
  },
  verification: {
    // Add these later when you register with search engines
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

// Structured Data for Search Engines (Organization & WebSite)
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Pura Pata",
  "url": "https://pura-pata.com",
  "logo": "https://pura-pata.com/logo.svg",
  "description": "Plataforma de adopción responsable de perros en Costa Rica",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "areaServed": "CR",
    "availableLanguage": "Spanish"
  }
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Pura Pata",
  "url": "https://pura-pata.com",
  "description": "Encuentra tu mejor amigo en Costa Rica. Plataforma de adopción responsable de perros.",
  "publisher": {
    "@type": "Organization",
    "name": "Pura Pata",
    "logo": {
      "@type": "ImageObject",
      "url": "https://pura-pata.com/logo.svg"
    }
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://pura-pata.com/perros?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Structured Data for Search Engines - Organization & WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
