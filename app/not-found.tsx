import type { Metadata } from 'next';

import ShopLayout from './(shop)/layout';
import ShopNotFound from './(shop)/not-found';

export const metadata: Metadata = { title: 'Página no encontrada' };

/** Unmatched URLs get the storefront chrome too, not the framework default. */
export default function RootNotFound() {
  return (
    <ShopLayout>
      <ShopNotFound />
    </ShopLayout>
  );
}
