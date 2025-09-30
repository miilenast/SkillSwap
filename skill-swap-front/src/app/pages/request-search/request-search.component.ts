import { Component, OnInit } from '@angular/core';
import { SkillRequestService} from '../../services/request/skill-request.service';
import { SkillRequest } from '../../models/request.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SkillCategory } from '../../models/enums.model';
import { SkillRequestFormComponent } from './make-offer/make-offer-component';
import { SwapOfferService } from '../../services/swap-offer/swap-offer.service';

@Component({
  selector: 'app-request-search',
  templateUrl: './request-search.component.html',
  styleUrls: ['./request-search.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, SkillRequestFormComponent],
})
export class RequestSearchComponent implements OnInit {
  requests: SkillRequest[] = [];
  selectedCategory: SkillCategory | null = null;
  selectedCategoryUnapplied: SkillCategory | null = null;
  categories: SkillCategory[] = Object.values(SkillCategory);
  selectedRequest: SkillRequest | null = null;
  showOfferFormModal: boolean = false;

  constructor(
    private skillRequestService: SkillRequestService,
    private swapOfferService: SwapOfferService,
  ) {}

  ngOnInit(): void {
    this.loadUserRequests();
  }

  loadUserRequests() {
    this.skillRequestService.getNearbyRequests().subscribe({
      next: (requests: SkillRequest[]) => {
        this.requests = requests;
      },
      error: (err) => {
        console.error('Greška pri učitavanju requestova:', err);
      }
    });
  }

  filterByCategory() {
    if (!this.selectedCategoryUnapplied) {
      this.loadUserRequests();
      return;
    }

    if(this.selectedCategoryUnapplied === this.selectedCategory) return;

    this.selectedCategory = this.selectedCategoryUnapplied;
    this.skillRequestService.getNearbyRequestsByCategory(this.selectedCategory).subscribe({
      next: (requests: SkillRequest[]) => {
        this.requests = requests;
      },
      error: (err) => {
        console.error('Greška pri filtriranju requestova:', err);
      }
    });
  }

  clearFilter(): void{
    this.selectedCategory = null;
    this.loadUserRequests();
  }

  openOfferForm(request: SkillRequest) {
    this.selectedRequest = this.requests.find(r => r.id === request.id) || null;
    this.showOfferFormModal = true;
  }

  closeOfferForm() {
    this.showOfferFormModal = false;
    this.selectedRequest = null;
  }

  viewProfile(userId: number) {
    // this.router.navigate(['/profile', userId]);
  }
}
