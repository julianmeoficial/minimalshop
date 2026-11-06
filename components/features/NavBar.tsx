'use client';

import { Menu, ShoppingBag, UserRound, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';

import { GlassSurface } from '@/components/ui';
import { fadeRise, reducedFade } from '@/lib/motion';

import styles from './NavBar.module.css';

export interface NavLinkItem {
  readonly href: string;
  readonly label: string;
}

export interface NavBarProps {
  readonly links: readonly NavLinkItem[];
  readonly userName: string | null;
  readonly showCart: boolean;
  readonly logoutAction: (() => Promise<void>) | null;
}

function isCurrent(pathname: string, href: string): boolean {
  if (href.includes('#')) {
    return false;
  }
  const path = href.split('?')[0] ?? href;
  return pathname === path || pathname.startsWith(`${path}/`);
}

/**
 * Buyer navigation — the single liquid glass bar (DESIGN.md §4, §9).
 * After the first scroll a veil fades in (opacity only, the blur never animates) so the
 * bar stays legible over photography. The mobile menu opens inside the same surface:
 * no glass on glass.
 */
export function NavBar({ links, userName, showCart, logoutAction }: NavBarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const linkList = (variant: 'bar' | 'menu') =>
    links.map((link) => (
      <li key={link.href}>
        <Link
          href={link.href}
          className={variant === 'bar' ? styles.link : styles.menuLink}
          aria-current={isCurrent(pathname, link.href) ? 'page' : undefined}
        >
          {link.label}
        </Link>
      </li>
    ));

  return (
    <div className={styles.wrap}>
      <GlassSurface
        as="header"
        variant="liquid"
        className={`${styles.bar} ${scrolled || open ? styles.scrolled : ''}`}
      >
        <span className={styles.veil} aria-hidden="true" />
        <div className={styles.row}>
          <Link className={styles.brand} href="/" aria-label="MinimalShop, inicio">
            Minimal<em>Shop</em>
          </Link>

          <nav className={styles.primary} aria-label="Principal">
            <ul className={styles.list}>{linkList('bar')}</ul>
          </nav>

          <div className={styles.actions}>
            {logoutAction ? (
              <form action={logoutAction} className={styles.desktopOnly}>
                <button className={styles.link} type="submit">
                  Salir
                </button>
              </form>
            ) : (
              <Link
                className={`${styles.link} ${styles.desktopOnly}`}
                href="/cuenta/ingreso"
                aria-current={isCurrent(pathname, '/cuenta/ingreso') ? 'page' : undefined}
              >
                Ingresar
              </Link>
            )}
            {showCart ? (
              <Link
                className={styles.cart}
                href="/carrito"
                aria-current={isCurrent(pathname, '/carrito') ? 'page' : undefined}
              >
                <ShoppingBag size={18} strokeWidth={1.5} aria-hidden />
                <span>Carrito</span>
              </Link>
            ) : null}
            <button
              ref={toggleRef}
              type="button"
              className={styles.toggle}
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? (
                <X size={18} strokeWidth={1.5} aria-hidden />
              ) : (
                <Menu size={18} strokeWidth={1.5} aria-hidden />
              )}
              <span>{open ? 'Cerrar' : 'Menú'}</span>
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              id={menuId}
              className={styles.menu}
              variants={reduced ? reducedFade : fadeRise}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <nav aria-label="Menú móvil">
                <ul className={styles.menuList}>{linkList('menu')}</ul>
              </nav>
              <div className={styles.menuFoot}>
                {userName ? (
                  <p className={styles.user}>
                    <UserRound size={16} strokeWidth={1.5} aria-hidden />
                    {userName}
                  </p>
                ) : null}
                {logoutAction ? (
                  <form action={logoutAction}>
                    <button className={styles.menuLink} type="submit">
                      Salir
                    </button>
                  </form>
                ) : (
                  <Link className={styles.menuLink} href="/cuenta/ingreso">
                    Ingresar
                  </Link>
                )}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </GlassSurface>
    </div>
  );
}
