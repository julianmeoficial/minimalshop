'use client';

import { ImagePlus, RefreshCw, Trash2, UploadCloud } from 'lucide-react';
import { useEffect, useId, useRef, useState, type DragEvent } from 'react';

import { Button, ProductImage } from '@/components/ui';
import { validateImage } from '@/lib/products/validation';

import styles from './ImageDropzone.module.css';

export interface ImageDropzoneProps {
  readonly file: File | null;
  readonly onFile: (file: File | null) => void;
  /** Photo already saved in the API (edit mode). */
  readonly currentUrl?: string | null | undefined;
  readonly error?: string | undefined;
  readonly onError: (message: string | undefined) => void;
}

function formatSize(bytes: number): string {
  return bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} KB`
    : `${(bytes / (1024 * 1024)).toLocaleString('es-CO', { maximumFractionDigits: 1 })} MB`;
}

/**
 * Product photo picker: drag and drop or browse, instant preview, change or remove.
 * The real `<input type="file">` stays in the tab order (visually hidden), so keyboard
 * and screen-reader users get the native picker.
 */
export function ImageDropzone({ file, onFile, currentUrl, error, onError }: ImageDropzoneProps) {
  const inputId = useId();
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const accept = (candidate: File | undefined) => {
    if (!candidate) return;
    const message = validateImage(candidate);
    onError(message);
    if (!message) onFile(candidate);
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    accept(event.dataTransfer.files[0]);
  };

  const shown = preview ?? currentUrl ?? null;
  const describedBy = [hintId, error ? errorId : null].filter(Boolean).join(' ');

  return (
    <div className={styles.root}>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className={styles.input}
        aria-describedby={describedBy}
        aria-invalid={Boolean(error)}
        onChange={(e) => {
          accept(e.target.files?.[0]);
          e.target.value = '';
        }}
      />

      {shown ? (
        <div className={styles.preview}>
          <div className={styles.frame}>
            <ProductImage
              src={shown}
              alt="Vista previa de la foto del producto"
              sizes="(max-width: 1023px) 100vw, 40vw"
              className={styles.image}
              fallback={<span className={styles.broken}>No pudimos mostrar esta foto.</span>}
            />
          </div>
          <div className={styles.meta}>
            <p className={styles.fileName}>
              {file ? (
                <>
                  {file.name} <span>· {formatSize(file.size)}</span>
                </>
              ) : (
                'Foto actual del producto'
              )}
            </p>
            <div className={styles.actions}>
              <Button variant="secondary" onClick={() => inputRef.current?.click()}>
                <RefreshCw size={16} strokeWidth={1.5} aria-hidden />
                Cambiar foto
              </Button>
              {file ? (
                <Button variant="tertiary" onClick={() => onFile(null)}>
                  <Trash2 size={16} strokeWidth={1.5} aria-hidden />
                  {currentUrl ? 'Descartar cambio' : 'Quitar'}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className={`${styles.zone} ${dragging ? styles.dragging : ''} ${error ? styles.invalid : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          {dragging ? (
            <UploadCloud size={32} strokeWidth={1.25} aria-hidden />
          ) : (
            <ImagePlus size={32} strokeWidth={1.25} aria-hidden />
          )}
          <span className={styles.zoneTitle}>
            {dragging ? 'Suelta la foto aquí' : 'Arrastra una foto o haz clic para elegirla'}
          </span>
        </label>
      )}

      <p id={hintId} className={styles.hint}>
        JPG, PNG o WebP · hasta 5 MB · mejor en vertical 4:5 (p. ej. 1200 × 1500 px), con luz
        natural y fondo limpio.
      </p>
      {error ? (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
