import type { Metadata, Viewport } from 'next';

import { atkinson, newsreader, plexMono } from './fonts';
import { ToastProvider } from '@/components/ui';
import { photos } from '@/lib/content/photos';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';

import '@/styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'MinimalShop — Objetos claros, vendidos sin ruido',
    template: '%s · MinimalShop',
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    siteName: SITE_NAME,
    url: '/',
    images: [{ url: photos.hero.src.src, alt: photos.hero.alt }],
  },
  twitter: { card: 'summary_large_image' },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#f7f4ee',
  colorScheme: 'only light',
};

/**
 * Runs before first paint: flags that JS motion will run so the hero can start hidden
 * (with a CSS fallback that reveals it if hydration is slow). Skipped with reduced motion.
 */
const MOTION_FLAG = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.motion='ok'}}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-CO"
      className={`${atkinson.variable} ${newsreader.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_FLAG }} />
      </head>
      <body>
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
