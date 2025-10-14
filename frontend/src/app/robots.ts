import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://pura-pata.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/auth/',
          '/_next/',
          '/publicar',
          '/perros/*/editar',
          '/mi-perfil',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/auth/',
          '/publicar',
          '/perros/*/editar',
          '/mi-perfil',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
