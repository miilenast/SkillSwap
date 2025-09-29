import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SkillRequestService } from '../../services/request/skill-request.service';
import { Skill } from '../../models/skill.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SwapOfferStatus } from '../../models/enums.model';
import { SwapOffer } from '../../models/swap-offer.model';
import { SwapOfferService } from '../../services/swap-offer/swap-offer.service';
import { SkillRequest } from '../../services/request/skill-request';

@Component({
  selector: 'app-request-offers',
  templateUrl: './request-offers.component.html',
  styleUrls: ['./request-offers.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class RequestOffersComponent implements OnInit {
  requestId!: number;
  offers: SwapOffer[] = [];
  userId: number = localStorage.getItem('userId') ? +localStorage.getItem('userId')! : 0;
  hasAccepted = false;
  request!: SkillRequest;
SwapOfferStatus: any;

  constructor(
    private route: ActivatedRoute,
    private offerService: SwapOfferService,
    private requestService: SkillRequestService,
    private router: Router
  ) {}

  ngOnInit() {
    this.requestId = +this.route.snapshot.paramMap.get('id')!;
    this.requestService.getOne(this.requestId).subscribe((request) => {
      this.request = request;
      this.loadOffers();
    });
  }

  loadOffers() {
    // this.offerService.getOffersForRequest(this.requestId).subscribe((offers) => {
    //   // filtriramo da vidi samo vlasnik zahteva
    //   this.offers = offers;
    //   this.hasAccepted = this.offers.some(o => o.status === 'ACCEPTED');
    // });
  }

  viewProfile(userId: number) {
    // this.router.navigate(['/profile', userId]);
  }

  acceptOffer(offer: SwapOffer) {
    offer.status = SwapOfferStatus.ACCEPTED;
    this.hasAccepted = true;
    this.offerService.update(offer.id, { status: SwapOfferStatus.ACCEPTED }).subscribe();

    this.offers.filter(o => o.id !== offer.id).forEach(o => {
      this.rejectOffer(o);
    });
  }

  rejectOffer(offer: SwapOffer) {
    offer.status = SwapOfferStatus.REJECTED;
    this.offerService.update(offer.id, { status: SwapOfferStatus.REJECTED }).subscribe();
  }
}
