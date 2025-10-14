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
    icon: '/logo.svg',
    apple: '/logo.svg',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
