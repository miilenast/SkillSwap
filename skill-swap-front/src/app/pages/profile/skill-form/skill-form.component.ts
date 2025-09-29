import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Skill } from '../../../models/skill.model';
import { SkillCategory } from '../../../models/enums.model';
import { SkillOfferStatus } from '../../../models/enums.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-skill-form',
  templateUrl: './skill-form.component.html',
  styleUrls: ['./skill-form.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SkillFormComponent implements OnChanges {
  @Input() mode!: 'edit' | 'delete' | 'add';
  @Input() skill: Skill | null = null;

  @Output() onSave = new EventEmitter<Skill>();
  @Output() onDelete = new EventEmitter<void>();
  @Output() onClose = new EventEmitter<void>();

  formData: Partial<Skill> = {};

  categories = Object.values(SkillCategory);
  statuses = Object.values(SkillOfferStatus);
  
  ngOnInit() {
    if (this.skill) {
      this.formData = { ...this.skill };
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.skill && this.mode === 'edit') this.formData = { ...this.skill };
  }

  submit() {
    this.onSave.emit(this.formData as Skill);
  }
}
