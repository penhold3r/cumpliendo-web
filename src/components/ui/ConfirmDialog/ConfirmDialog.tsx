'use client';

import { useEffect } from 'react';
import { Button, Text } from '@latty-ds/react';
import { useTranslation } from '@/i18n';
import styles from './ConfirmDialog.module.css';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  destructive = false,
}: ConfirmDialogProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        onClick={e => e.stopPropagation()}
      >
        <Text
          as="h2"
          variant="h4"
          id="confirm-dialog-title"
          className={styles.title}
        >
          {title}
        </Text>
        <Text
          variant="body-sm"
          id="confirm-dialog-message"
          className={styles.message}
        >
          {message}
        </Text>
        <div className={styles.actions}>
          <Button
            variant="neutral"
            onClick={onCancel}
          >
            {cancelLabel ?? t('common.cancel')}
          </Button>
          <Button
            variant="primary"
            className={destructive ? styles.destructive : undefined}
            onClick={onConfirm}
          >
            {confirmLabel ?? t('common.delete')}
          </Button>
        </div>
      </div>
    </div>
  );
}
