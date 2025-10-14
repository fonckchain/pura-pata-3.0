import { Dog } from '@/types';

interface DogStructuredDataProps {
  dog: Dog;
}

export default function DogStructuredData({ dog }: DogStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Adoptar a ${dog.name}`,
    description: dog.description || `${dog.name} es un ${dog.breed} de ${dog.age_years} años buscando un hogar amoroso en ${dog.province}, Costa Rica.`,
    image: dog.photos && dog.photos.length > 0 ? dog.photos : [],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CRC',
      availability: dog.status === 'disponible' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `https://pura-pata.com/perros/${dog.id}`,
    },
    brand: {
      '@type': 'Organization',
      name: 'Pura Pata',
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Raza',
        value: dog.breed,
      },
      {
        '@type': 'PropertyValue',
        name: 'Edad',
        value: `${dog.age_years} años${dog.age_months ? ` y ${dog.age_months} meses` : ''}`,
      },
      {
        '@type': 'PropertyValue',
        name: 'Género',
        value: dog.gender === 'macho' ? 'Macho' : 'Hembra',
      },
      {
        '@type': 'PropertyValue',
        name: 'Tamaño',
        value: dog.size,
      },
      {
        '@type': 'PropertyValue',
        name: 'Ubicación',
        value: `${dog.canton || ''} ${dog.province}, Costa Rica`.trim(),
      },
      {
        '@type': 'PropertyValue',
        name: 'Vacunado',
        value: dog.vaccinated ? 'Sí' : 'No',
      },
      {
        '@type': 'PropertyValue',
        name: 'Esterilizado',
        value: dog.sterilized ? 'Sí' : 'No',
      },
      {
        '@type': 'PropertyValue',
        name: 'Desparasitado',
        value: dog.dewormed ? 'Sí' : 'No',
      },
    ],
  };

  // Also add BreadcrumbList for better navigation understanding
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: 'https://pura-pata.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Perros en Adopción',
        item: 'https://pura-pata.com',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: dog.name,
        item: `https://pura-pata.com/perros/${dog.id}`,
      },
    ],
  };

  // Add LocalBusiness schema for better local SEO
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Pura Pata',
    description: 'Plataforma de adopción responsable de perros en Costa Rica',
    url: 'https://pura-pata.com',
    logo: 'https://pura-pata.com/logo.svg',
    sameAs: [
      // Add your social media profiles here when available
      // 'https://www.facebook.com/purapata',
      // 'https://www.instagram.com/purapata',
      // 'https://twitter.com/purapata',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      areaServed: 'CR',
      availableLanguage: 'Spanish',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Costa Rica',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
    </>
  );
}
