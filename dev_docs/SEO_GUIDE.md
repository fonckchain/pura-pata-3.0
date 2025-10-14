# Guía de SEO y Presencia Online - Pura Pata

## Resumen de Implementación

Esta guía documenta todas las optimizaciones de SEO implementadas para mejorar la presencia online de Pura Pata en motores de búsqueda y redes sociales.

## 🎯 Optimizaciones Implementadas

### 1. Sitemap Dinámico (`/sitemap.xml`)

**Archivo**: `frontend/src/app/sitemap.ts`

- ✅ Sitemap XML automático generado por Next.js
- ✅ Incluye todas las páginas estáticas (home, login, registro, publicar)
- ✅ Incluye dinámicamente todos los perros disponibles
- ✅ Se actualiza automáticamente cada hora (revalidate: 3600)
- ✅ Incluye `lastModified`, `changeFrequency` y `priority` para cada URL

**Acceso**: `https://pura-pata.com/sitemap.xml`

### 2. Robots.txt (`/robots.txt`)

**Archivo**: `frontend/src/app/robots.ts`

- ✅ Permite indexación de páginas públicas
- ✅ Bloquea indexación de:
  - `/api/` - Endpoints del API
  - `/auth/` - Páginas de autenticación
  - `/publicar` - Formulario de publicación (requiere auth)
  - `/perros/*/editar` - Páginas de edición
  - `/mi-perfil` - Perfil privado
- ✅ Referencia al sitemap
- ✅ Reglas específicas para Googlebot

**Acceso**: `https://pura-pata.com/robots.txt`

### 3. Meta Tags Mejorados

**Archivo**: `frontend/src/app/layout.tsx`

#### Meta Tags Básicos:
- `title` con template para páginas individuales
- `description` optimizada con keywords relevantes
- `keywords` extensa con términos de búsqueda costarricenses
- `authors`, `creator`, `publisher`

#### Open Graph (Facebook, LinkedIn):
- Título, descripción e imagen optimizados
- `locale: es_CR` para Costa Rica
- Tipo de contenido: website
- URL canónica

#### Twitter Cards:
- Summary large image
- Título y descripción optimizados
- Handle de Twitter (`@purapata`)

#### Configuración de Robots:
- `index: true` - Permite indexación
- `follow: true` - Sigue enlaces
- Configuración específica de Googlebot
- Max image preview: large
- Max snippet: sin límite

#### Keywords Implementadas:
```javascript
[
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
]
```

### 4. Structured Data (Schema.org JSON-LD)

**Archivo**: `frontend/src/components/DogStructuredData.tsx`

Implementa tres tipos de structured data en cada página de perro:

#### A. Product Schema:
```json
{
  "@type": "Product",
  "name": "Adoptar a [Nombre]",
  "description": "...",
  "image": [...],
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "CRC",
    "availability": "InStock/OutOfStock"
  },
  "additionalProperty": [
    { "name": "Raza", "value": "..." },
    { "name": "Edad", "value": "..." },
    { "name": "Género", "value": "..." },
    ...
  ]
}
```

#### B. BreadcrumbList Schema:
- Mejora la navegación en resultados de búsqueda
- Muestra: Inicio > Perros en Adopción > [Nombre del Perro]

#### C. Organization Schema:
- Información de Pura Pata como organización
- Logo, descripción, área de servicio (Costa Rica)
- Contact point
- Links a redes sociales (cuando estén disponibles)

**Beneficios**:
- Rich snippets en Google
- Información detallada en resultados de búsqueda
- Mayor CTR (Click-Through Rate)
- Mejor posicionamiento local

### 5. PWA Manifest (`/manifest.json`)

**Archivo**: `frontend/public/manifest.json`

- ✅ Nombre completo y corto de la app
- ✅ Descripción
- ✅ Theme color (#d97706 - naranja de Pura Pata)
- ✅ Background color blanco
- ✅ Display mode: standalone
- ✅ Iconos del logo
- ✅ Shortcuts para acceso rápido
- ✅ Categorías: lifestyle, social
- ✅ Idioma: es-CR

**Beneficios**:
- App instalable en dispositivos móviles
- Mejor experiencia de usuario
- Acceso offline potencial
- Aparece como app nativa

### 6. Optimizaciones de Performance

**Archivo**: `frontend/next.config.mjs`

#### Compresión y Seguridad:
- `compress: true` - Compresión gzip/brotli
- `poweredByHeader: false` - Oculta "X-Powered-By: Next.js"
- `reactStrictMode: true` - Modo estricto de React

#### Optimización de Imágenes:
- Formatos modernos: AVIF y WebP
- Device sizes optimizados para diferentes pantallas
- Image sizes para thumbnails y previews
- Remote patterns para Supabase y Unsplash

#### HTTP Headers:
- `X-DNS-Prefetch-Control: on` - Pre-fetch de DNS
- `X-Frame-Options: SAMEORIGIN` - Protección contra clickjacking
- `X-Content-Type-Options: nosniff` - Previene MIME sniffing
- `Referrer-Policy: origin-when-cross-origin` - Control de referrer
- Cache inmutable para logo (1 año)

## 📊 Cómo Medir el Impacto

### Google Search Console

1. Registra el sitio en [Google Search Console](https://search.google.com/search-console)
2. Verifica la propiedad con el código en `layout.tsx` (comentado)
3. Envía el sitemap: `https://pura-pata.com/sitemap.xml`
4. Monitorea:
   - Impresiones y clics
   - Posición promedio
   - CTR (Click-Through Rate)
   - Cobertura de índice
   - Core Web Vitals

### Google Analytics

1. Crea una propiedad en [Google Analytics](https://analytics.google.com)
2. Agrega el tracking code en `layout.tsx`
3. Configura objetivos:
   - Adopciones completadas
   - Publicaciones de perros
   - Contactos vía WhatsApp
   - Tiempo en sitio

### PageSpeed Insights

Prueba regularmente en [PageSpeed Insights](https://pagespeed.web.dev/):
- Performance score
- Accessibility
- Best Practices
- SEO score
- Core Web Vitals:
  - LCP (Largest Contentful Paint)
  - FID (First Input Delay)
  - CLS (Cumulative Layout Shift)

## 🚀 Próximos Pasos para Mejorar SEO

### 1. Crear Contenido de Calidad

**Blog de Adopción** (`/blog`):
- Guías de adopción responsable
- Cuidado de perros rescatados
- Historias de éxito
- Tips de adiestramiento
- Salud canina

**Beneficios**:
- Más páginas indexables
- Keywords de long-tail
- Backlinks naturales
- Autoridad de dominio

### 2. Link Building

- Registrarse en directorios de mascotas CR
- Colaborar con veterinarias
- Alianzas con refugios
- Guest posting en blogs de mascotas
- Menciones en medios locales

### 3. Local SEO

**Google Business Profile**:
- Crear perfil de empresa
- Agregar ubicación (si aplica)
- Fotos y actualizaciones
- Reseñas de adoptantes

**Schema LocalBusiness**:
```javascript
{
  "@type": "LocalBusiness",
  "name": "Pura Pata",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "CR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "9.7489",
    "longitude": "-83.7534"
  }
}
```

### 4. Social Media Integration

Crear y mantener activos:
- Facebook Page
- Instagram (@purapata)
- Twitter/X (@purapata)
- TikTok (contenido viral de perros)

Agregar botones de compartir en:
- Páginas de perros individuales
- Historias de adopción
- Blog posts

### 5. Mejorar Core Web Vitals

**LCP (Largest Contentful Paint)**:
- Optimizar carga de imágenes principales
- Usar `priority` en Image de Next.js
- Implementar lazy loading

**FID (First Input Delay)**:
- Minimizar JavaScript
- Code splitting
- Dynamic imports

**CLS (Cumulative Layout Shift)**:
- Definir width/height de imágenes
- Reservar espacio para ads (si hay)
- Evitar inserción de contenido dinámico

### 6. Implementar AMP (Accelerated Mobile Pages)

Para blog posts y páginas de perros:
- Versiones AMP de contenido
- Carga ultra-rápida en móvil
- Mejor posicionamiento en Google

### 7. Rich Snippets Adicionales

**FAQ Schema** (para página de ayuda):
```javascript
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cómo adoptar un perro?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "..."
      }
    }
  ]
}
```

**Review Schema** (testimonios de adoptantes):
```javascript
{
  "@type": "Review",
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "5"
  },
  "author": {
    "@type": "Person",
    "name": "..."
  }
}
```

## 🔍 Verificación de Search Engines

### Google

1. Ve a [Google Search Console](https://search.google.com/search-console)
2. Agrega propiedad: `https://pura-pata.com`
3. Verifica con meta tag o DNS
4. Envía sitemap
5. Solicita indexación de páginas clave

### Bing

1. Ve a [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Agrega sitio
3. Verifica propiedad
4. Envía sitemap

### Verificación Manual

Busca en Google:
```
site:pura-pata.com
```

Esto muestra todas las páginas indexadas.

## 📈 KPIs a Monitorear

### Orgánico (SEO)
- **Tráfico orgánico mensual**
- **Keywords en top 10**
- **Backlinks adquiridos**
- **Domain Authority (DA)**
- **Page Authority (PA)**

### Engagement
- **Bounce rate** (< 50% es bueno)
- **Tiempo promedio en sitio** (> 2 min es bueno)
- **Páginas por sesión** (> 3 es bueno)
- **Tasa de conversión** (contactos/visitas)

### Técnico
- **Page Speed Score** (> 90)
- **Mobile Usability** (100%)
- **Core Web Vitals** (todos "Good")
- **Errores de rastreo** (0)

## 🛠️ Herramientas Útiles

### Análisis SEO
- [Google Search Console](https://search.google.com/search-console)
- [Google Analytics](https://analytics.google.com)
- [Ahrefs](https://ahrefs.com) - Backlinks y keywords
- [SEMrush](https://semrush.com) - Competencia y keywords
- [Moz](https://moz.com) - Domain Authority

### Performance
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com)
- [WebPageTest](https://webpagetest.org)

### Testing SEO
- [Rich Results Test](https://search.google.com/test/rich-results) - Structured data
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [Schema Markup Validator](https://validator.schema.org/)

### Monitoreo
- [Google Alerts](https://google.com/alerts) - Menciones de marca
- [Mention](https://mention.com) - Social listening
- [Uptime Robot](https://uptimerobot.com) - Monitoring de uptime

## 📝 Checklist de Mantenimiento SEO

### Mensual
- [ ] Revisar Google Search Console para errores
- [ ] Analizar keywords con mejor/peor rendimiento
- [ ] Actualizar contenido antiguo
- [ ] Verificar links rotos
- [ ] Revisar velocidad del sitio

### Trimestral
- [ ] Auditoría SEO completa
- [ ] Análisis de competencia
- [ ] Actualizar estrategia de keywords
- [ ] Revisar y actualizar meta descriptions
- [ ] Análisis de backlinks

### Anual
- [ ] Evaluación completa de estrategia SEO
- [ ] Actualizar objetivos y KPIs
- [ ] Inversión en link building
- [ ] Considerar SEO profesional
- [ ] Auditoría técnica profunda

## 🎓 Recursos de Aprendizaje

- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Moz Beginner's Guide to SEO](https://moz.com/beginners-guide-to-seo)
- [Ahrefs Blog](https://ahrefs.com/blog/)
- [Search Engine Journal](https://www.searchenginejournal.com/)
- [Google Search Central Blog](https://developers.google.com/search/blog)

## 📞 Soporte

Para preguntas sobre SEO de Pura Pata, contactar al equipo de desarrollo o contratar un especialista en SEO para Costa Rica.

---

**Última actualización**: {{ fecha actual }}
**Implementado por**: Claude Code
**Versión**: 1.0
