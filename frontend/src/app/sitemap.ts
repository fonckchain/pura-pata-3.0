import { MetadataRoute } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pura-pata.com';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/registro`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/publicar`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/recuperar-password`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Fetch all available dogs for dynamic pages
  let dogPages: MetadataRoute.Sitemap = [];
  try {
    const response = await fetch(`${API_URL}/dogs?status=disponible`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (response.ok) {
      const dogs = await response.json();
      dogPages = dogs.map((dog: any) => ({
        url: `${baseUrl}/perros/${dog.id}`,
        lastModified: new Date(dog.updated_at || dog.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error('Error fetching dogs for sitemap:', error);
  }

  return [...staticPages, ...dogPages];
}
