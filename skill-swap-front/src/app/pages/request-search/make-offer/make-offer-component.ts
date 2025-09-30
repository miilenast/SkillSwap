import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges } from '@angular/core';
import { SkillCategory, SkillOfferStatus, SkillRequestStatus } from '../../../models/enums.model';
import { SkillRequest } from '../../../models/request.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SwapOffer } from '../../../services/swap-offer/swap-offer';
import { Skill } from '../../../models/skill.model';
import { SkillService } from '../../../services/skill-offer/skill-offer.service';
import { SwapOfferService } from '../../../services/swap-offer/swap-offer.service';

@Component({
  selector: 'app-skill-request-form',
  templateUrl: './make-offer-component.html',
  styleUrls: ['./make-offer-component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SkillRequestFormComponent {
  @Input() request: SkillRequest | null = null;
  @Input() requesterSkills: Skill[] = [];
  @Output() onClose = new EventEmitter<void>();

  userSkills: Skill[] = [];
  userSkillsMatchingCategory: Skill[] = [];
  selectedOfferedSkill: Skill | null = null;
  selectedRequestedSkill: Skill | null = null;

  constructor(
    private skillService: SkillService,
    private swapOfferService: SwapOfferService
  ) {}

  ngOnInit() {
    if (this.request?.user.id) {
      this.skillService.getUserSkills(String(this.request.user.id)).subscribe({
        next: (skills: Skill[]) => {
          this.requesterSkills = skills;
          this.requesterSkills = this.requesterSkills.filter(this.filterByAvailability);
          this.selectedRequestedSkill = this.requesterSkills[0] || null; 
        },
        error: (err) => console.error('Greška pri učitavanju veština tražioca:', err)
      });
    }

    this.loadCurrentUserSkills();
  }

  loadCurrentUserSkills(): void {
    this.skillService.getUserSkills(localStorage.getItem('userId')!).subscribe({
      next: (skills: Skill[]) => {
        this.userSkills = skills;
        this.userSkills = this.userSkills.filter(this.filterByAvailability);
        this.filterSkillsByCategory();
      },
      error: (err) => console.error('Greška pri učitavanju veština korisnika:', err)
    });
  }

  filterSkillsByCategory(): void {
    if (this.request?.title) {
      this.userSkillsMatchingCategory = this.userSkills.filter(
        skill => skill.title === this.request!.title
      );
      this.selectedOfferedSkill = this.userSkillsMatchingCategory[0] || null; 
    }
  }

  filterByAvailability = (skill: Skill): boolean => {
    return skill.status === SkillOfferStatus.AVAILABLE;
  };

  submit() {
    if (!this.selectedOfferedSkill || !this.selectedRequestedSkill) {
      alert('Morate odabrati veštinu koju nudite i veštinu koju tražite.');
      return;
    }

    console.log("Nudim ID:", this.selectedOfferedSkill.id);
    console.log("Tražim ID:", this.selectedRequestedSkill.id);

    const newOffer = {
      offeredSkillId: this.selectedOfferedSkill.id, 
      requestedSkillId: this.selectedRequestedSkill.id, 
      requestId: this.request?.id,
    };

    this.swapOfferService.create(newOffer).subscribe({
      next: (res) => {
        alert('Ponuda je poslata!');
        this.onClose.emit();
      },
      error: (err) => {
        console.error('Greška:', err);
        alert('Došlo je do greške pri slanju ponude.');
      },
    });
  }
}
