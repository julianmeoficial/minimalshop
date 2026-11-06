import type { MetadataRoute } from 'next';

import { absoluteUrl } from '@/lib/site';

/** Index the storefront; keep private and transactional routes out of search engines. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/carrito', '/checkout', '/cuenta/', '/vendedor/', '/api/'],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
