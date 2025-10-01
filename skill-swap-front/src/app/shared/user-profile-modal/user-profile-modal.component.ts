import { Component, Inject, OnInit } from '@angular/core';
import { UserCardData } from '../../models/usercard.model';
import { UserService } from '../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { UserCardComponent } from '../../components/user-card/user-card.component';
import { SkillService } from '../../services/skill-offer/skill-offer.service';
import { switchMap } from 'rxjs';
import { Skill } from '../../models/skill.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private userService: UserService ,
    private skillService: SkillService
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.isLoading = true;

    this.userService.getUserById(this.data.userId).pipe(
      switchMap(user => {
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
          skills: user.skills || []
        };
        console.log(`User ID: ${user.id}, Profile Picture: ${profilePictureValue}`);
        return this.skillService.getUserSkills(user.id?.toString() || '');
      })
    ).subscribe({
      next: (skills: Skill[]) => {
        if(this.userProfileData) {
          this.userProfileData.skills = skills;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading user profile or skills:', err);
        this.isLoading = false;
      }
    });
  }
}
