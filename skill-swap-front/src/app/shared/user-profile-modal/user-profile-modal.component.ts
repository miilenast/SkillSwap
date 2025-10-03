import { Component, Inject, OnInit } from '@angular/core';
import { UserCardData } from '../../models/usercard.model';
import { UserService } from '../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { UserCardComponent } from '../../components/user-card/user-card.component';
import { SkillService } from '../../services/skill-offer/skill-offer.service';
import { forkJoin, switchMap } from 'rxjs';
import { Skill } from '../../models/skill.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReviewService } from '../../services/review/review.service';
import { Review } from '../../models/review.model';

export interface DialogData {
  userId: number;
} 

@Component({
  selector: 'app-user-profile-modal',
  templateUrl: './user-profile-modal.component.html',
  styleUrl: './user-profile-modal.component.scss',
  standalone: true,
  imports: [CommonModule, MatDialogModule, UserCardComponent, MatButtonModule, MatIconModule],
})
export class UserProfileModalComponent implements OnInit {
  userProfileData!: UserCardData;
  isLoading = true;
  averageRating: number | null = null;
  totalReviews: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private userService: UserService ,
    private skillService: SkillService,
    private reviewService: ReviewService,
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.isLoading = true;

    const user$ = this.userService.getUserById(this.data.userId);
    const skills$ = this.skillService.getUserSkills(this.data.userId.toString());
    const reviews$ = this.reviewService.getReviewsReceived(this.data.userId);

    forkJoin({ user: user$, skills: skills$, reviews: reviews$ }).subscribe({
      next: ({ user, skills, reviews }) => {
        let profilePictureValue = '';
        if (typeof user.profilePicture === 'string' && 
            user.profilePicture !== '[null]' && 
            user.profilePicture.length > 0) 
        {
          profilePictureValue = user.profilePicture;
        }

        this.userProfileData = {
          id: user.id ?? 0,
          firstName: user.firstName ?? '',
          lastName: user.lastName ?? '',
          profilePicture: profilePictureValue,
          phoneNumber: user.phoneNumber ?? '',
          skills: skills
        };
        
        this.calculateRating(reviews);
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading user profile data:', err);
        this.isLoading = false;
      }
    });
  }

  calculateRating(reviews: Review[]) {
    if (reviews && reviews.length > 0) {
      this.totalReviews = reviews.length;
      const sum = reviews.reduce((acc, review) => acc + (review.rating ?? 0), 0);
      this.averageRating = parseFloat((sum / reviews.length).toFixed(2)); 
    }
    else {
      this.averageRating = null;
      this.totalReviews = 0;
    }
  }
}
