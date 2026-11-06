import { CreditCard, PackageCheck, Search, ShoppingBag, type LucideIcon } from 'lucide-react';

import styles from './ProcessIndex.module.css';

interface Step {
  readonly title: string;
  readonly body: string;
  readonly icon: LucideIcon;
}

const STEPS: readonly Step[] = [
  {
    title: 'Elige',
    body: 'Doce piezas por página, filtros por categoría y precio. Sin scroll infinito.',
    icon: Search,
  },
  {
    title: 'Agrega',
    body: 'Tu carrito se guarda en tu cuenta y nunca pierde datos si algo falla.',
    icon: ShoppingBag,
  },
  {
    title: 'Paga',
    body: 'Checkout en una columna y pago con pasarela externa. No guardamos tu tarjeta.',
    icon: CreditCard,
  },
  {
    title: 'Recibe',
    body: 'Cada pedido muestra su estado: pendiente, pagado, enviado, entregado.',
    icon: PackageCheck,
  },
];

/** KORVAE "material library": a narrow numbered index separated by vertical hairlines. */
export function ProcessIndex() {
  return (
    <ol className={styles.list}>
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        return (
          <li key={step.title} className={styles.item} data-reveal>
            <span className={styles.number}>{String(i + 1).padStart(2, '0')}</span>
            <Icon className={styles.icon} size={20} strokeWidth={1.5} aria-hidden />
            <h3 className={styles.title}>{step.title}</h3>
            <p className={styles.body}>{step.body}</p>
          </li>
        );
      })}
    </ol>
  );
}
