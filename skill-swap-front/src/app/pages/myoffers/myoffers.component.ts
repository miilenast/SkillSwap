import { Component, OnInit } from '@angular/core';
import { SwapOffer } from '../../models/swap-offer.model';
import { SwapOfferStatus } from '../../models/enums.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SwapOfferService } from '../../services/swap-offer/swap-offer.service';
import { RatingResponse, ReviewService } from '../../services/review/review.service';
import { MatDialog } from '@angular/material/dialog';
import { UserProfileModalComponent } from '../../shared/user-profile-modal/user-profile-modal.component';
import { ContactDialogData, ContactInfoModal } from '../../shared/contact-info-modal/contact-info-modal.component';
import { ContactOnlyModal, ContactData } from '../../shared/contact-only-modal/contact-only.component';
import { ReviewDialogData, ReviewModal } from '../../shared/review-modal/review-modal.component';
import { Review } from '../../services/review/review';


@Component({
  selector: 'app-myoffers.component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './myoffers.component.html',
  styleUrls: ['./myoffers.component.scss']
})
export class MyOffersComponent implements OnInit {
  userId: number = localStorage.getItem('userId') ? +localStorage.getItem('userId')! : 0;
  allOffers: SwapOffer[] = [];
  offers: SwapOffer[] = [];
  selectedStatusUnapplied: SwapOfferStatus | null = null;
  selectedStatusApplied: SwapOfferStatus | null = null;
  offerStatusValues: string[] = Object.values(SwapOfferStatus);

  public readonly SwapOfferStatus = SwapOfferStatus;

  constructor(
    private offerService: SwapOfferService,
    private reviewService: ReviewService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.loadMyOffers();
  }

  loadMyOffers() {
    if (!this.userId) {
      console.error('User not logged in or userId not found.');
      return;
    }
    this.offerService.getOffersByOffererId(this.userId).subscribe({
      next: (offers) => {
        this.allOffers = offers;
        this.applySort(this.allOffers);
        this.applyFilter();
      },
      error: (err) => {
        console.error('Error fetching my offers:', err);
      }
    });
  }

  applySort(list: SwapOffer[]) {
    const statusOrder = [ 
      SwapOfferStatus.ACCEPTED,
      SwapOfferStatus.DONE,
      SwapOfferStatus.PENDING,
      SwapOfferStatus.REJECTED,
    ];

    const sortOffers = (a: SwapOffer, b: SwapOffer) => {
      const indexA = statusOrder.indexOf(a.status);
      const indexB = statusOrder.indexOf(b.status);
      if (indexA === -1 && indexB !== -1) return 1;
      if (indexA !== -1 && indexB === -1) return -1;
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA !== indexB) {
        return indexA - indexB;
      }
      return a.id - b.id;
    };
    
    this.offers = [...list].sort(sortOffers);
  }

  applyFilter() {
    let filteredOffers = this.allOffers;
    if (this.selectedStatusApplied) {
      filteredOffers = filteredOffers.filter(offer => 
        offer.status === this.selectedStatusApplied
      );
    }
    this.applySort(filteredOffers);
  }

  filterByStatus() {
    this.selectedStatusApplied = this.selectedStatusUnapplied;
    this.applyFilter();
  }

  clearStatusFilter() {
    this.selectedStatusApplied = null;
    this.selectedStatusUnapplied = null;
    this.applyFilter();
  }
  
  viewRequestOwnerProfile(requestOwnerId: number) {
    if (requestOwnerId) {
      this.dialog.open(UserProfileModalComponent, {
        width: '400px',
        data: { userId: requestOwnerId }
      });
    } else {
      console.error('Invalid user ID provided for profile view.');
    }
  }

  handleAction(offer: SwapOffer) {
    if (offer.status === SwapOfferStatus.DONE || offer.status === SwapOfferStatus.ACCEPTED) {
      const partnerId = offer.request.user.id;
      const phoneNumber = offer.request.user.phoneNumber;
      const ime = offer.request.user.firstName;
      const prezime = offer.request.user.lastName;

      if (!phoneNumber && offer.status === SwapOfferStatus.ACCEPTED) {
        this.dialog.open(UserProfileModalComponent, { 
          data: { 
            message: 'Korisnik nije uneo broj telefona. Ne možete da ga kontaktirate.',
            isAlert: true
          } 
        });
        return;
      }

      if(offer.status === SwapOfferStatus.DONE) {
        this.reviewService.getRatingForUser(partnerId).subscribe({
          next: (_response: RatingResponse) => {
            const reviewData: ReviewDialogData = {
              ime: ime,
              prezime: prezime,
              requestId: offer.request.id,
              partnerId: partnerId,
              currentRating: _response.rating,
              existingReviewId: _response.reviewId || null,
              acceptedOfferId: offer.id,
            }

            this.dialog.open(ReviewModal, {
              width: '400px',
              data: reviewData
            }).afterClosed().subscribe(result => {
              if(result) {
                this.loadMyOffers();
              }
            });
          },
          error: (err) => {
            console.error('Error fetching rating:', err);
          }
        });
      } else if (offer.status === SwapOfferStatus.ACCEPTED) {
         const dialogData: ContactData = {
          phoneNumber: phoneNumber!,
          ime: ime,
          prezime: prezime,
        }

        this.dialog.open(ContactOnlyModal, { 
          width: '400px',
          data: dialogData
        });
      }

    } else {
      console.log('Akcija nije dostupna za status:', offer.status);
    }
  }
}