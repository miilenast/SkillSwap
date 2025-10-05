import { Component, OnInit } from '@angular/core';
import { Skill } from '../../models/skill.model';
import { User } from '../../models/user.model';
import { SkillService } from '../../services/skill-offer/skill-offer.service';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SkillFormComponent } from './skill-form/skill-form.component';
import { Review } from '../../services/review/review';
import { ReviewService } from '../../services/review/review.service';
import { map, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, SkillFormComponent]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  showSkillForm: 'edit' | 'delete' | 'add' | null = null;
  selectedSkill: Skill | null = null;
  averageRating: number | null = null;
  totalReviews: number = 0;

  constructor(
    private skillService: SkillService,
    private authService: AuthService,
    private reviewService: ReviewService,
  ) {}

  ngOnInit(): void {
    this.fetchUserData();
  }

  fetchAverageRating() {
    if (this.user?.id !== undefined) {
      this.reviewService.getReviewsReceived(this.user.id).subscribe({
        next: (reviews: Review[]) => {
          if (reviews && reviews.length > 0) {
            const sum = reviews.reduce((acc, review) => acc + (review.rating ?? 0), 0);
            this.averageRating = parseFloat((sum / reviews.length).toFixed(2));
            this.totalReviews = reviews.length;
          }
          else {
            this.averageRating = null;
          }
        },
        error: (err) => {
          console.error('Error fetching ratings:', err);
          this.averageRating = null;
        }
      });
    }
  }

  fetchUserData() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) return;

    fetch(`${'http://localhost:3000/auth/profile'}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        this.skillService.getUserSkills(localStorage.getItem('userId')!).pipe(
          tap(skills => {
            this.user = { ...data, offers: skills };
            this.fetchAverageRating();
          }),
          switchMap(() => {
            const currentUserId = localStorage.getItem('userId');
            return currentUserId ? this.reviewService.getReviewsReceived(+currentUserId) : of([]);
          })
        ).subscribe();
      })
      .catch(err => console.error(err));
  }

  openSkillForm(mode: 'edit' | 'delete' | 'add', skill?: Skill) {
    this.selectedSkill = skill || null;
    this.showSkillForm = mode;
  }

  closeSkillForm() {
    this.showSkillForm = null;
    this.selectedSkill = null;
  }

  saveSkill(skill: Skill) {
    const token = localStorage.getItem('token');
    if (!token) return;

    const obs = this.showSkillForm === 'add' 
      ? this.skillService.addSkill(skill)
      : this.skillService.editSkill(skill);

    obs.subscribe(data => {
      if (!this.user) return;
      if (this.showSkillForm === 'add') {
        this.user.offers = [...(this.user.offers ?? []), data];
      } else {
        this.user.offers = this.user.offers?.map(o => o.id === data.id ? data : o);
      }
      this.closeSkillForm();
    });
  }

  deleteSkill() {
    const token = localStorage.getItem('token');
    if (!token || !this.selectedSkill) return;

    this.skillService.deleteSkill(this.selectedSkill.id!).subscribe(() => {
      if (!this.user) return;
      this.user.offers = this.user.offers?.filter(o => o.id !== this.selectedSkill!.id);
      this.closeSkillForm();
    });
  }
}
