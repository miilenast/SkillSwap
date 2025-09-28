import React, { useState } from 'react';
import styles from './SkillFormModal.module.css'; 
import type { Skill } from '../../types/Skill';
import { SkillCategory } from '../../types/skill-category.enum';

interface SkillFormProps {
  skills: Skill[];
  onClose: () => void;
  onSave: (updatedSkills: Skill[]) => void;
}

const SkillForm: React.FC<SkillFormProps> = ({ skills, onClose, onSave }) => {
  const [currentSkills, setCurrentSkills] = useState<Skill[]>(skills);
  const [newSkill, setNewSkill] = useState<Omit<Skill, 'status'>>({
    title: '',
    description: '',
  });

  const handleAddSkill = () => {
    if (newSkill.title.trim() === '') return;
    setCurrentSkills([
      ...currentSkills,
      { ...newSkill, status: 'dostupan' }, 
    ]);
    setNewSkill({ title: '', description: '' });
  };

  const handleDeleteSkill = (titleToDelete: string) => {
    setCurrentSkills(currentSkills.filter(skill => skill.title !== titleToDelete));
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Izmeni veštine</h3>
        <div className={styles.skillsList}>
          {currentSkills.map((skill, index) => (
            <div key={index} className={styles.skillItem}>
              <span>{skill.title} - {skill.description} ({skill.status})</span>
              <button onClick={() => handleDeleteSkill(skill.title)}>Obriši</button>
            </div>
          ))}
        </div>
        <div className={styles.addSkillForm}>
          <select
            value={newSkill.title}
            onChange={(e) => setNewSkill({ ...newSkill, title: e.target.value })}
          >
            <option value="">Odaberi veštinu</option>
            {Object.values(SkillCategory).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Opis veštine"
            value={newSkill.description}
            onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
          />
          <button onClick={handleAddSkill}>Dodaj</button>
        </div>
        <div className={styles.actions}>
          <button onClick={() => onSave(currentSkills)}>Sačuvaj</button>
          <button onClick={onClose}>Zatvori</button>
        </div>
      </div>
    </div>
  );
};

export default SkillForm;