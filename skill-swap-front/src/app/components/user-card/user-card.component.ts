import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UserCardData } from '../../models/usercard.model';
import { SkillOfferStatus } from '../../models/enums.model';
import { Skill } from '../../models/skill.model';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class UserCardComponent {
  @Input({ required: true }) user!: UserCardData;
  @Input() showPhoneNumber: boolean = false;
  
  get activeSkills(): Skill[] {
    if(!this.user.skills) {
      return [];
    }
    return this.user.skills.filter(skill => skill.status === SkillOfferStatus.AVAILABLE);
  }
}
