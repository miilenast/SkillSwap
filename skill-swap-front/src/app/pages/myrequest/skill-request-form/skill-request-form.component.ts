import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges } from '@angular/core';
import { SkillCategory, SkillRequestStatus } from '../../../models/enums.model';
import { SkillRequest } from '../../../models/request.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skill-request-form',
  templateUrl: './skill-request-form.component.html',
  styleUrls: ['./skill-request-form.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SkillRequestFormComponent {
  @Input() request: SkillRequest | null = null;
  @Output() onSave = new EventEmitter<SkillRequest>();
  @Output() onClose = new EventEmitter<void>();

  categories = Object.values(SkillCategory);
  statuses = Object.values(SkillRequestStatus);
  formData: Partial<SkillRequest> = {};

  ngOnInit() {
    if (this.request) {
      this.formData = { ...this.request };
    }
  }

  submit() {
    this.onSave.emit(this.formData as SkillRequest);
  }
}
