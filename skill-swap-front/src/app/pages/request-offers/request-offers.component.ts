import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SkillRequestService } from '../../services/request/skill-request.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SkillRequestStatus, SwapOfferStatus } from '../../models/enums.model';
import { SwapOffer } from '../../models/swap-offer.model';
import { SwapOfferService } from '../../services/swap-offer/swap-offer.service';
import { SkillRequest } from '../../models/request.model';
import { forkJoin, map, Observable } from 'rxjs';
import { UserProfileModalComponent } from '../../shared/user-profile-modal/user-profile-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ContactInfoModal } from '../../shared/contact-info-modal/contact-info-modal.component';
import { RatingResponse, ReviewService } from '../../services/review/review.service';
import { ContactDialogData } from '../../shared/contact-info-modal/contact-info-modal.component';

@Component({
  selector: 'app-request-offers',
  templateUrl: './request-offers.component.html',
  styleUrls: ['./request-offers.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class RequestOffersComponent implements OnInit {
  requestId!: number;
  allOffers: SwapOffer[] = [];
  offers: SwapOffer[] = [];
  userId: number = localStorage.getItem('userId') ? +localStorage.getItem('userId')! : 0;
  hasAccepted = false;
  request!: SkillRequest;
  selectedStatusUnapplied: SwapOfferStatus | null = null;
  selectedStatusApplied: SwapOfferStatus | null = null;
  offerStatusValues: string[] = Object.values(SwapOfferStatus);

  public readonly SwapOfferStatus = SwapOfferStatus;

  constructor(
    private route: ActivatedRoute,
    private offerService: SwapOfferService,
    private requestService: SkillRequestService,
    private reviewService: ReviewService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.requestId = +this.route.snapshot.paramMap.get('id')!;
    this.requestService.getOne(this.requestId).subscribe({
      next: (req) => {
        this.request = req;
        this.loadOffers();
      },
      error: (err) => {
        console.error('Error fetching request:', err);
      }
    });
  }

  loadOffers() {
    this.offerService.getAll(this.requestId).subscribe({
      next: (offers) => {
        this.allOffers = offers;
        this.applySort(this.allOffers);
        this.applyFilter();
        this.hasAccepted = this.offers.some(o => o.status === SwapOfferStatus.ACCEPTED);
        const statusOrder = [ SwapOfferStatus.DONE, SwapOfferStatus.ACCEPTED, SwapOfferStatus.PENDING, SwapOfferStatus.REJECTED ];
        const sortOffers = (a: SwapOffer, b: SwapOffer) => {
          const indexA = statusOrder.indexOf(a.status);
          const indexB = statusOrder.indexOf(b.status);
          if(indexA === -1 && indexB !== -1) return 1;
          if(indexA !== -1 && indexB === -1) return -1;
          if(indexA === -1 && indexB === -1) return 0;
          return indexA - indexB;
        }

        this.offers = offers.sort(sortOffers);
        this.hasAccepted = this.offers.some(o => o.status === SwapOfferStatus.ACCEPTED);
      },
      error: (err) => {
        console.error('Error fetching offers:', err);
      }
    });
  }

  applySort(list: any[]) {
    const statusOrder = [ SwapOfferStatus.DONE, SwapOfferStatus.ACCEPTED, SwapOfferStatus.PENDING, SwapOfferStatus.REJECTED ];
    const sortOffers = (a: SwapOffer, b: SwapOffer) => {
      const indexA = statusOrder.indexOf(a.status);
      const indexB = statusOrder.indexOf(b.status);
      if(indexA === -1 && indexB !== -1) return 1;
      if(indexA !== -1 && indexB === -1) return -1;
      if(indexA === -1 && indexB === -1) return 0;
      return indexA - indexB;
    }
    this.offers = list.sort(sortOffers);
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

  viewProfile(userId: number) {
    if (userId) {
      this.dialog.open(UserProfileModalComponent, {
        width: '400px',
        data: { userId: userId }
      });
    } else {
      console.error('Invalid user ID provided for profile view.');
    }
  }

  acceptOffer(offer: SwapOffer) {
    offer.status = SwapOfferStatus.ACCEPTED;
    this.hasAccepted = true;
    const acceptedOffer$ = this.offerService.update(offer.id, { status: SwapOfferStatus.ACCEPTED });
    const updateRequest$ = this.request
      ? this.requestService.update(this.requestId, { status: SkillRequestStatus.ACCEPTED })
      : new Observable(subscriber => subscriber.complete());
    const rejectedObservables = this.offers
      .filter(o => o.id !== offer.id)
      .map(o => this.rejectOffer(o));

    forkJoin([acceptedOffer$, updateRequest$, ...rejectedObservables]).subscribe({
      next: () => {
        this.loadOffers();
      },
      error: (err) => {
        console.error('Error processing offers:', err);
        this.loadOffers();
      }
    });
  }

  rejectOffer(offer: SwapOffer): Observable<SwapOffer> {
    offer.status = SwapOfferStatus.REJECTED;
    return this.offerService.update(offer.id, { status: SwapOfferStatus.REJECTED }).pipe(
      map(() => offer)
    );
  }

  handleRejectOffer(offer: SwapOffer) {
    this.rejectOffer(offer).subscribe({
      next: () => {
        this.loadOffers();
      },
      error: (err) => {
        console.error('Error rejecting offer:', err);
      }
    });
  }

  showContactInfo(offer: SwapOffer) {
    const phoneNumber = offer.offerer.phoneNumber;
    const ime = offer.offerer.firstName;
    const prezime = offer.offerer.lastName;
    const partnerId = offer.offerer.id;
    const acceptedOffer = this.offers.find(o => o.status === SwapOfferStatus.ACCEPTED);
    const accepterOfferId = acceptedOffer ? acceptedOffer.id : null;

    if(phoneNumber) {
      this.reviewService.getRatingForUser(partnerId).subscribe({
        next: (_response: RatingResponse) => {
          const dialogData: ContactDialogData = {
            phoneNumber: phoneNumber,
            ime: ime,
            prezime: prezime,
            requestId: this.requestId,
            partnerId: partnerId,
            currentRating: _response.rating,
            existingReviewId: _response.reviewId || null,
            acceptedOfferId: accepterOfferId,
          }
          console.log('Opening contact info modal with data:', dialogData);
          this.dialog.open(ContactInfoModal, { 
            width: '400px',
            data: dialogData
          }).afterClosed().subscribe(result => {
            if(result) {
              this.loadOffers();
            }
          });
        },
        error: (err) => {
          console.error('Error fetching rating:', err);
        }
      });
    } else {
      this.dialog.open(UserProfileModalComponent, { 
        data: { 
            message: 'Korisnik nije uneo broj telefona. Ne možete da ga kontaktirate.',
            isAlert: true
        } 
      });
      return;
    }
  }
}
