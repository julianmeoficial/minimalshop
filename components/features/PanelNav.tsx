'use client';

import {
  BarChart3,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Package,
  Plus,
  Power,
  Store,
  Tags,
  Users,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import styles from './SellerSidebar.module.css';

/** Icon names are strings so server layouts can describe the nav without passing functions. */
const ICONS = {
  resumen: LayoutDashboard,
  productos: Package,
  nuevo: Plus,
  pedidos: ClipboardList,
  usuarios: Users,
  categorias: Tags,
  modulos: Power,
  pagos: CreditCard,
  reportes: BarChart3,
} satisfies Record<string, LucideIcon>;

export type PanelIcon = keyof typeof ICONS;

export interface PanelLink {
  readonly href: string;
  readonly label: string;
  readonly icon: PanelIcon;
  /** Match only the exact path (for index pages like /admin). */
  readonly exact?: boolean;
}

export interface PanelNavProps {
  readonly label: string;
  readonly links: readonly PanelLink[];
  readonly logoutAction: () => Promise<void>;
}

export function PanelNav({ label, links, logoutAction }: PanelNavProps) {
  const pathname = usePathname();
  // The most specific matching link wins (so /productos/nuevo doesn't light up /productos).
  const active = links
    .filter((l) => (l.exact ? pathname === l.href : pathname === l.href || pathname.startsWith(`${l.href}/`)))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <nav className={styles.nav} aria-label={label}>
      <ul className={styles.list}>
        {links.map(({ href, label: text, icon }) => {
          const Icon = ICONS[icon];
          return (
            <li key={href}>
              <Link
                className={styles.link}
                href={href}
                aria-current={active === href ? 'page' : undefined}
              >
                <Icon size={18} strokeWidth={1.5} aria-hidden />
                {text}
              </Link>
            </li>
          );
        })}
      </ul>
      <ul className={`${styles.list} ${styles.secondary}`}>
        <li>
          <Link className={styles.link} href="/catalogo">
            <Store size={18} strokeWidth={1.5} aria-hidden />
            Ver la tienda
          </Link>
        </li>
        <li>
          <form action={logoutAction}>
            <button className={styles.link} type="submit">
              <LogOut size={18} strokeWidth={1.5} aria-hidden />
              Salir
            </button>
          </form>
        </li>
      </ul>
    </nav>
  );
}
