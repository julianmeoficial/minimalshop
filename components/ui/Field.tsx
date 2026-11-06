import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

import styles from './Field.module.css';

type Common = {
  readonly label: string;
  readonly hint?: string | undefined;
  readonly error?: string | undefined;
  readonly id: string;
};

export type FieldProps =
  | (Common & {
      readonly as?: 'input';
    } & InputHTMLAttributes<HTMLInputElement>)
  | (Common & {
      readonly as: 'textarea';
    } & TextareaHTMLAttributes<HTMLTextAreaElement>)
  | (Common & {
      readonly as: 'select';
      readonly children: ReactNode;
    } & SelectHTMLAttributes<HTMLSelectElement>);

export function Field(props: FieldProps) {
  const { label, hint, error, id, as = 'input', className, ...rest } = props;
  const invalid = Boolean(error);
  const describedBy = [
    hint ? `${id}-hint` : null,
    error ? `${id}-error` : null,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  const controlClass = [
    styles.control,
    invalid ? styles.invalid : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  let control: ReactNode;
  if (as === 'textarea') {
    const textareaProps = rest as TextareaHTMLAttributes<HTMLTextAreaElement>;
    control = (
      <textarea
        id={id}
        className={controlClass}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        {...textareaProps}
      />
    );
  } else if (as === 'select') {
    const selectProps = rest as SelectHTMLAttributes<HTMLSelectElement> & {
      children?: ReactNode;
    };
    const { children, ...selectRest } = selectProps;
    control = (
      <select
        id={id}
        className={controlClass}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        {...selectRest}
      >
        {children}
      </select>
    );
  } else {
    const inputProps = rest as InputHTMLAttributes<HTMLInputElement>;
    if (inputProps.type === 'checkbox' || inputProps.type === 'radio') {
      control = (
        <div className={styles.checkRow}>
          <input
            id={id}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            {...inputProps}
          />
          <span aria-hidden="true" />
        </div>
      );
    } else {
      control = (
        <input
          id={id}
          className={controlClass}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          {...inputProps}
        />
      );
    }
  }

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      {control}
      {hint ? (
        <p className={styles.help} id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className={styles.error} id={`${id}-error`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
