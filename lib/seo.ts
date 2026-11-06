import type { ProductoListado } from '@/lib/api/types';

import { absoluteUrl, SITE_NAME } from './site';

type Json = Record<string, unknown>;

/** schema.org Product with a COP offer; availability mirrors stock and pre-sale. */
export function productJsonLd(p: ProductoListado): Json {
  const availability = !p.disponible
    ? 'https://schema.org/OutOfStock'
    : p.preventa
      ? 'https://schema.org/PreOrder'
      : 'https://schema.org/InStock';
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.nombre,
    sku: p.id,
    category: p.categoria.nombre,
    ...(p.descripcion ? { description: p.descripcion } : {}),
    ...(p.imagenUrl ? { image: [p.imagenUrl] } : {}),
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(`/catalogo/${p.id}`),
      priceCurrency: 'COP',
      price: p.precio,
      availability,
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: p.vendedor.nombre },
    },
  };
}

export function breadcrumbJsonLd(items: readonly { name: string; path: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Home: the site plus a search action so engines can offer a search box. */
export function websiteJsonLd(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: absoluteUrl('/'),
    inLanguage: 'es-CO',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${absoluteUrl('/catalogo')}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function faqJsonLd(items: readonly { question: string; answer: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
