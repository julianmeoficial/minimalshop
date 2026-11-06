import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

import styles from './Pagination.module.css';

export interface PaginationProps {
  readonly pagina: number;
  readonly totalPaginas: number;
  readonly totalElementos: number;
  readonly tamano: number;
  /** Builds href for a zero-based page index. */
  readonly hrefForPage: (pagina: number) => string;
  /** Show "Mostrando X a Y de Z" (hide when the page already shows it). */
  readonly showSummary?: boolean;
}

/** Numbered pagination — never infinite scroll on the catalogue (DESIGN.md §8). */
export function Pagination({
  pagina,
  totalPaginas,
  totalElementos,
  tamano,
  hrefForPage,
  showSummary = true,
}: PaginationProps) {
  if (totalPaginas <= 1) {
    return null;
  }

  const from = totalElementos === 0 ? 0 : pagina * tamano + 1;
  const to = Math.min(totalElementos, (pagina + 1) * tamano);
  const pages = Array.from({ length: totalPaginas }, (_, i) => i);
  const hasPrev = pagina > 0;
  const hasNext = pagina < totalPaginas - 1;

  return (
    <nav className={styles.root} aria-label="Paginación">
      {showSummary ? (
        <p className={styles.summary}>
          Mostrando {from} a {to} de {totalElementos}
        </p>
      ) : null}
      <ul className={styles.list}>
        <li>
          {hasPrev ? (
            <Link href={hrefForPage(pagina - 1)} className={styles.step} rel="prev">
              <ChevronLeft size={16} strokeWidth={1.5} aria-hidden />
              Anterior
            </Link>
          ) : (
            <span className={`${styles.step} ${styles.disabled}`} aria-disabled="true">
              <ChevronLeft size={16} strokeWidth={1.5} aria-hidden />
              Anterior
            </span>
          )}
        </li>
        {pages.map((p) => (
          <li key={p}>
            <Link
              href={hrefForPage(p)}
              className={styles.page}
              aria-current={p === pagina ? 'page' : undefined}
              aria-label={`Página ${p + 1}`}
            >
              {p + 1}
            </Link>
          </li>
        ))}
        <li>
          {hasNext ? (
            <Link href={hrefForPage(pagina + 1)} className={styles.step} rel="next">
              Siguiente
              <ChevronRight size={16} strokeWidth={1.5} aria-hidden />
            </Link>
          ) : (
            <span className={`${styles.step} ${styles.disabled}`} aria-disabled="true">
              Siguiente
              <ChevronRight size={16} strokeWidth={1.5} aria-hidden />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
