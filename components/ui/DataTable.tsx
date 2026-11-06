import type { ReactNode } from 'react';

import styles from './DataTable.module.css';

export interface DataTableColumn<T> {
  readonly key: string;
  readonly header: string;
  readonly render: (row: T) => ReactNode;
}

export interface DataTableProps<T> {
  readonly columns: readonly DataTableColumn<T>[];
  readonly rows: readonly T[];
  readonly rowKey: (row: T) => string;
  readonly caption?: string;
  readonly empty?: ReactNode;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  caption,
  empty,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return <div className={styles.wrap}>{empty ?? <p>Sin datos.</p>}</div>;
  }

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        {caption ? <caption>{caption}</caption> : null}
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} scope="col">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((col) => (
                <td key={col.key}>{col.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.cards}>
        {rows.map((row) => (
          <article key={rowKey(row)} className={styles.card}>
            {columns.map((col) => (
              <div key={col.key}>
                <div className={styles.cardLabel}>{col.header}</div>
                <div>{col.render(row)}</div>
              </div>
            ))}
          </article>
        ))}
      </div>
    </div>
  );
}
