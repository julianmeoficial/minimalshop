'use client';

import Image, { type StaticImageData } from 'next/image';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import { canOptimizeImage } from '@/lib/images';

export interface ProductImageProps {
  readonly src: string | StaticImageData;
  readonly alt: string;
  readonly sizes: string;
  readonly className?: string | undefined;
  readonly priority?: boolean | undefined;
  /** Other URLs to try, in order, before giving up (e.g. more photos of the category). */
  readonly alternates?: readonly string[] | undefined;
  /** Shown instead of a broken image when every URL fails (404, expired signature…). */
  readonly fallback: ReactNode;
}

/**
 * Product photo from the API. Remote URLs come from sellers and can break, so a failed
 * load swaps to a designed fallback instead of the browser's broken-image icon.
 * Always used with `fill` inside a positioned media box.
 */
export function ProductImage({
  src,
  alt,
  sizes,
  className,
  priority = false,
  alternates = [],
  fallback,
}: ProductImageProps) {
  const sources: readonly (string | StaticImageData)[] = [src, ...alternates];
  const [index, setIndex] = useState(0);
  const current = sources[index];
  const imgRef = useRef<HTMLImageElement>(null);

  // An eager (priority) image can fail before hydration attaches onError: catch it here.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setIndex((i) => i + 1);
    }
  }, [index]);

  if (current === undefined) {
    return <>{fallback}</>;
  }

  return (
    <Image
      ref={imgRef}
      key={index}
      src={current}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      unoptimized={typeof current === 'string' && !canOptimizeImage(current)}
      onError={() => setIndex((i) => i + 1)}
    />
  );
}
