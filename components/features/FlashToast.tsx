'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { useToast } from '@/components/ui';

export interface FlashToastProps {
  readonly message: string;
  readonly tone?: 'success' | 'error';
}

/**
 * One-shot success toast after a redirect (e.g. `?agregado=1`). Shows the crystal toast
 * once, then drops the query param so a reload does not repeat it.
 */
export function FlashToast({ message, tone = 'success' }: FlashToastProps) {
  const { push } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const shown = useRef(false);

  useEffect(() => {
    if (shown.current) {
      return;
    }
    shown.current = true;
    push({ tone, message });
    router.replace(pathname, { scroll: false });
  }, [message, tone, pathname, push, router]);

  return null;
}
