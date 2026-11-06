import type { ReactNode } from 'react';

import { SellerShell } from '@/components/features/SellerSidebar';

export default function SellerLayout({ children }: { children: ReactNode }) {
  return <SellerShell>{children}</SellerShell>;
}
