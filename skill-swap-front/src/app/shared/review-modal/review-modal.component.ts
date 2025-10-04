import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ReviewService } from '../../services/review/review.service';
import { forkJoin, Observable, of } from 'rxjs';

export interface ReviewDialogData {
  ime: string;
  prezime: string;
  requestId: number;
  partnerId: number;
  currentRating: number;
  existingReviewId: number | null;
  acceptedOfferId: null | number;
}

@Component({
  selector: 'app-contact-info-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, FormsModule],
  templateUrl: './review-modal.component.html',
  styleUrls: ['./review-modal.component.scss']
})
export class ReviewModal implements OnInit {
  starRating: number = 0;
  stars: number[] = [1, 2, 3, 4, 5];
  isAlreadyRated: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ReviewDialogData,
    private reviewService: ReviewService,
    private dialogRef: MatDialogRef<ReviewModal>
  ) {}

  ngOnInit() {
    this.starRating = this.data.currentRating;
    this.isAlreadyRated = this.data.currentRating > 0;
  }

  rate(star: number){
    this.starRating = star;
  }

  review() {
    let updateRating$: Observable<any>;
    if(this.starRating > 0) {
      if(this.isAlreadyRated) {
        updateRating$ = this.reviewService.update(this.data.existingReviewId!, { rating: this.starRating });
      }
      else {
        const reviewData: { rating: number, reviewedUserId: number } = {
          rating: this.starRating,
          reviewedUserId: this.data.partnerId
        };
        updateRating$ = this.reviewService.create(reviewData);
      }
    } else {
        updateRating$ = of(null);
    }

    forkJoin([updateRating$]).subscribe({
      next: () => {
        alert('Uspešno ste ocenili korisnika.');
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error submitting review:', err);
        this.dialogRef.close(false);
      }
    });
  }
}