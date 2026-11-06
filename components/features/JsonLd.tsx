export interface JsonLdProps {
  readonly data: Record<string, unknown> | readonly Record<string, unknown>[];
}

/**
 * schema.org structured data. `<` is escaped so product text can never close the script.
 */
export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
