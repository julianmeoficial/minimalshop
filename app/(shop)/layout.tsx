import type { ReactNode } from 'react';

import { BuyerNav } from '@/components/features/BuyerNav';
import { SiteFooter } from '@/components/features/SiteFooter';

import styles from './layout.module.css';

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <BuyerNav />
      <main id="contenido" className={styles.main} tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
