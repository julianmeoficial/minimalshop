/** Hosts configured in next.config `images.remotePatterns`; others are served as-is. */
const OPTIMIZABLE_HOSTS = new Set(['images.unsplash.com']);

/**
 * True when next/image can resize and re-encode this URL. Storage URLs signed by the API
 * expire and vary per request, so they stay `unoptimized`.
 */
export function canOptimizeImage(url: string): boolean {
  try {
    const { protocol, hostname } = new URL(url);
    return protocol === 'https:' && OPTIMIZABLE_HOSTS.has(hostname);
  } catch {
    return false;
  }
}

/**
 * Server-side reachability check for a single remote image (HEAD, cached for an hour).
 * Use sparingly — for one hero pick, not for grids, which rely on `ProductImage` fallbacks.
 */
export async function isImageReachable(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(2500),
    });
    return res.ok;
  } catch {
    return false;
  }
}
