import React, { useState, useEffect } from 'react';
import styles from './SkillFormModal.module.css';
import type { Skill } from '../../types/Skill';
import { SkillCategory } from '../../types/skill-category.enum';
import { SkillOfferStatus } from '../../types/skill-offer-status.enum';

interface SkillFormProps {
  mode: 'edit' | 'delete' | 'add';
  skill: Skill | null;
  onClose: () => void;
  onSave: (skillData: Skill) => void;
  onDelete: () => void;
}

const SkillForm = ({ mode, skill, onClose, onSave, onDelete }: SkillFormProps) => {
  const [formData, setFormData] = useState<Skill>({
    id: skill?.id ?? undefined,
    title: skill?.title ?? '',
    description: skill?.description ?? '',
    status: skill?.status ?? 'dostupan',
  });

  useEffect(() => {
    if (skill && mode === 'edit') {
      setFormData(skill);
    }
  }, [skill, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (mode === 'delete') {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h3>Brisanje veštine</h3>
          <p>Trajno ćete izbrisati svoju veštinu. Da li ste sigurni da želite da obrišete veštinu "{skill?.title}"?</p>
          <div className={styles.actions}>
            <button onClick={onDelete}>Obriši</button>
            <button onClick={onClose}>Odustani</button>
          </div>
        </div>
      </div>
    );
  }

  const isEditMode = mode === 'edit';
  const modalTitle = isEditMode ? 'Izmeni veštinu' : 'Nova veština';

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>{modalTitle}</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Kategorija</label>
            <select
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            >
              <option value="">Odaberi veštinu</option>
              {Object.values(SkillCategory).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Opis</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="">Odaberi status</option>
              {Object.values(SkillOfferStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className={styles.actions}>
            <button type="submit">Sačuvaj</button>
            <button type="button" onClick={onClose}>Zatvori</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkillForm;
