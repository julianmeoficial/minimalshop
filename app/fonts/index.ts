import localFont from 'next/font/local';

/**
 * Self-hosted Google Fonts latin subsets.
 * Avoids next/font/google build flake when gstatic returns extensionless /l/font?kit= URLs
 * (vercel/next.js#99114 — TypeError: Cannot read properties of null (reading '1')).
 */

export const atkinson = localFont({
  src: [
    {
      path: './AtkinsonHyperlegibleNext-latin.woff2',
      weight: '200 800',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-atkinson',
  adjustFontFallback: false,
});

export const newsreader = localFont({
  src: [
    {
      path: './Newsreader-latin.woff2',
      weight: '200 800',
      style: 'normal',
    },
    {
      path: './Newsreader-Italic-latin.woff2',
      weight: '200 800',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-newsreader',
});

export const plexMono = localFont({
  src: [
    {
      path: './IBMPlexMono-Medium-latin.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-plex-mono',
});
