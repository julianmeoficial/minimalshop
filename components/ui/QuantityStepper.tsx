'use client';

import styles from './QuantityStepper.module.css';

export interface QuantityStepperProps {
  readonly value: number;
  readonly min?: number;
  readonly max?: number;
  readonly onChange: (value: number) => void;
  readonly variant?: 'compact' | 'normal';
  readonly id?: string;
  readonly label?: string;
  readonly disabled?: boolean;
}

export function QuantityStepper({
  value,
  min = 1,
  max = 100,
  onChange,
  variant = 'normal',
  id,
  label = 'Cantidad',
  disabled = false,
}: QuantityStepperProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  return (
    <div
      className={`${styles.root} ${variant === 'compact' ? styles.compact : ''}`}
    >
      <button
        type="button"
        className={styles.button}
        aria-label={`Disminuir ${label}`}
        disabled={disabled || value <= min}
        onClick={() => onChange(clamp(value - 1))}
      >
        −
      </button>
      <input
        id={id}
        className={styles.input}
        type="number"
        inputMode="numeric"
        aria-label={label}
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (Number.isFinite(next)) {
            onChange(clamp(next));
          }
        }}
      />
      <button
        type="button"
        className={styles.button}
        aria-label={`Aumentar ${label}`}
        disabled={disabled || value >= max}
        onClick={() => onChange(clamp(value + 1))}
      >
        +
      </button>
    </div>
  );
}
