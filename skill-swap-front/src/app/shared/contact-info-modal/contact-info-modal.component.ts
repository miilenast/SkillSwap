import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { SkillRequestService } from '../../services/request/skill-request.service';
import { SkillRequestStatus, SwapOfferStatus } from '../../models/enums.model';
import { ReviewService } from '../../services/review/review.service';
import { forkJoin, Observable, of } from 'rxjs';
import { SwapOfferService } from '../../services/swap-offer/swap-offer.service';

export interface ContactDialogData {
  phoneNumber: string;
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
  templateUrl: './contact-info-modal.component.html',
  styleUrls: ['./contact-info-modal.component.scss']
})
export class ContactInfoModal implements OnInit {
  starRating: number = 0;
  stars: number[] = [1, 2, 3, 4, 5]; 
  isAlreadyRated: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ContactDialogData,
    private requestService: SkillRequestService,
    private swapOfferService: SwapOfferService,
    private reviewService: ReviewService,
    private dialogRef: MatDialogRef<ContactInfoModal>
  ) {}

  ngOnInit() {
    this.starRating = this.data.currentRating;
    this.isAlreadyRated = this.data.currentRating > 0;
  }

  rate(star: number){
    this.starRating = star;
  }

  finalizeSwap() {
    let updateRating$: Observable<any>;
    if(this.starRating > 0) {
      if(this.isAlreadyRated) {
        updateRating$ = this.reviewService.update(this.data.existingReviewId!, { rating: this.starRating });
      }
      else {
        const reviewData: { rating: number, reviewedUserId: number } = {
          rating: this.starRating,
          reviewedUserId: this.data.partnerId,
        };
        updateRating$ = this.reviewService.create(reviewData);
      }
    }
    else {
      updateRating$ = of(true);
    }
    
    const finalizeRequest$ = this.requestService.update(this.data.requestId, { status: SkillRequestStatus.DONE });

    let finalizeOffer$: Observable<any>;
    if (this.data.acceptedOfferId) {
      finalizeOffer$ = this.swapOfferService.update(this.data.acceptedOfferId, { status: SwapOfferStatus.DONE });
    }
    else {
      finalizeOffer$ = of(true);
    }
    
    forkJoin([updateRating$, finalizeRequest$, finalizeOffer$]).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error finalizing swap', err);
        this.dialogRef.close(false);
      }
    });
  }
}
