import type { Metadata } from "next";
import "./globals.css";
import 'leaflet/dist/leaflet.css';

export const metadata: Metadata = {
  title: "Pura Pata - Adopción de Perros en Costa Rica",
  description: "Encuentra tu mejor amigo. Plataforma de adopción de perros en Costa Rica.",
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'es_CR',
    url: 'https://pura-pata.com',
    siteName: 'Pura Pata',
    title: 'Pura Pata - Adopción de Perros en Costa Rica',
    description: 'Encuentra tu mejor amigo. Miles de perros esperando un hogar en Costa Rica.',
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: 'Pura Pata Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pura Pata - Adopción de Perros en Costa Rica',
    description: 'Encuentra tu mejor amigo. Miles de perros esperando un hogar en Costa Rica.',
    images: ['/logo.svg'],
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
