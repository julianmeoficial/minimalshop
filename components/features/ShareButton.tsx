'use client';

import { Share2 } from 'lucide-react';

import { Button, useToast } from '@/components/ui';

export interface ShareButtonProps {
  readonly title: string;
  readonly text?: string | undefined;
}

/** Native share sheet on phones; copies the link elsewhere and confirms with a toast. */
export function ShareButton({ title, text }: ShareButtonProps) {
  const { push } = useToast();

  const share = async () => {
    const url = window.location.href;
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share(text ? { title, text, url } : { title, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return; // the person closed the share sheet
        }
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      push({ tone: 'success', message: 'Enlace copiado.' });
    } catch {
      push({ tone: 'error', message: 'No pudimos copiar el enlace. Cópialo desde la barra de direcciones.' });
    }
  };

  return (
    <Button variant="tertiary" onClick={() => void share()}>
      <Share2 size={16} strokeWidth={1.5} aria-hidden />
      Compartir
    </Button>
  );
}
