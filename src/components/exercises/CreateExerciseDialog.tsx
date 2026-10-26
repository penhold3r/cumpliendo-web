'use client';

import { useState } from 'react';
import { Text } from '@latty-ds/react';
import { useTranslation } from '@/i18n';
import styles from './CreateExerciseDialog.module.css';

interface CreateExerciseDialogProps {
  open: boolean;
  onClose: () => void;
  onSave?: (exercise: { name: string; category: string; equipment: string; description?: string }) => void;
}

export function CreateExerciseDialog({ open, onClose, onSave }: CreateExerciseDialogProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('chest');
  const [equipment, setEquipment] = useState('barbell');
  const [description, setDescription] = useState('');

  if (!open) {
    return null;
  }

  const handleSave = () => {
    if (name.trim()) {
      onSave?.({ name: name.trim(), category, equipment, description: description.trim() || undefined });
      setName('');
      setCategory('chest');
      setEquipment('barbell');
      setDescription('');
      onClose();
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <div className={styles.header}>
          <Text as="h2" variant="lead" className={styles.title}>
            {t('addExercise.createTitle')}
          </Text>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label={t('common.close')}
          >
            {t('common.close')}
          </button>
        </div>

        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>{t('addExercise.nameLabel')}</label>
            <input
              type="text"
              className={styles.input}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={t('addExercise.namePlaceholder')}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>{t('addExercise.category')}</label>
            <select
              className={styles.input}
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="chest">Chest</option>
              <option value="back">Back</option>
              <option value="legs">Legs</option>
              <option value="shoulders">Shoulders</option>
              <option value="arms">Arms</option>
              <option value="core">Core</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>{t('addExercise.equipment')}</label>
            <select
              className={styles.input}
              value={equipment}
              onChange={e => setEquipment(e.target.value)}
            >
              <option value="barbell">Barbell</option>
              <option value="dumbbells">Dumbbells</option>
              <option value="kettlebell">Kettlebell</option>
              <option value="cable">Cable</option>
              <option value="machine">Machine</option>
              <option value="none">None</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>{t('addExercise.descLabel')}</label>
            <textarea
              className={styles.input}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={t('addExercise.descPlaceholder')}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button
            className={styles.saveButton}
            onClick={handleSave}
            disabled={!name.trim()}
          >
            {t('addExercise.saveAndAdd')}
          </button>
        </div>
      </div>
    </div>
  );
}
