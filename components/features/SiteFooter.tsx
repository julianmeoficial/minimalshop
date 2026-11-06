import Link from 'next/link';

import styles from './SiteFooter.module.css';

const COLUMNS = [
  {
    title: 'Explorar',
    links: [
      { href: '/catalogo', label: 'Catálogo' },
      { href: '/catalogo?orden=precio_asc', label: 'Precio ascendente' },
      { href: '/funcionamiento', label: 'Funcionamiento' },
      { href: '/preguntas-frecuentes', label: 'Preguntas frecuentes' },
    ],
  },
  {
    title: 'Cuenta',
    links: [
      { href: '/cuenta/ingreso', label: 'Ingresar' },
      { href: '/cuenta/registro', label: 'Crear cuenta' },
      { href: '/cuenta/pedidos', label: 'Mis pedidos' },
      { href: '/carrito', label: 'Carrito' },
    ],
  },
  {
    title: 'Vender',
    links: [
      { href: '/funcionamiento#key', label: 'MinimalShop Key' },
      { href: '/cuenta/registro', label: 'Abrir una tienda' },
      { href: '/vendedor/productos', label: 'Panel del vendedor' },
    ],
  },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandCol}>
          <p className={styles.brand}>
            Minimal<em>Shop</em>
          </p>
          <p className={styles.tagline}>
            Objetos claros para casas con memoria larga. Hecho para pequeños
            vendedores.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} className={styles.col} aria-label={col.title}>
            <h2 className={styles.colTitle}>{col.title}</h2>
            <ul className={styles.list}>
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link className={styles.link} href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className={styles.legal}>
        <p>© {year} MinimalShop. Todos los derechos reservados.</p>
        <p>
          Precios en pesos colombianos ·{' '}
          <Link className={styles.link} href="/creditos">
            Créditos de fotografía
          </Link>
        </p>
      </div>
    </footer>
  );
}
