import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { AdminShell } from '@/components/features/SellerSidebar';

export const metadata: Metadata = {
  title: { default: 'Administración', template: '%s · Administración · MinimalShop' },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
