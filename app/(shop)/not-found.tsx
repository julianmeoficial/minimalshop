import { EmptyState } from '@/components/features/EmptyState';
import { Button } from '@/components/ui';
import { photos } from '@/lib/content/photos';

export default function ShopNotFound() {
  return (
    <EmptyState
      eyebrow="Error 404"
      title="Esta página no está en el catálogo"
      photo={photos.cuencos}
      action={
        <>
          <Button href="/catalogo">Ir al catálogo</Button>
          <Button href="/" variant="tertiary">
            Volver al inicio
          </Button>
        </>
      }
    >
      <p>Puede que la pieza ya no esté publicada o que el enlace tenga un error.</p>
    </EmptyState>
  );
}
