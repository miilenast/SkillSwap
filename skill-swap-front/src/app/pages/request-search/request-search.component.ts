import { Component, OnInit } from '@angular/core';
import { SkillRequestService} from '../../services/request/skill-request.service';
import { SkillRequest } from '../../models/request.model';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SkillCategory } from '../../models/enums.model';

@Component({
  selector: 'app-request-search',
  templateUrl: './request-search.component.html',
  styleUrls: ['./request-search.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class RequestSearchComponent implements OnInit {
  requests: SkillRequest[] = [];
  filteredRequests: SkillRequest[] = [];
  myCategory: SkillCategory | null = null;
  filterForm: FormGroup;
  offerForm: FormGroup;
  selectedRequestId: number | null = null;

  constructor(
    private skillRequestService: SkillRequestService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      category: ['all']
    });

    this.offerForm = this.fb.group({
      skillCategory: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserCategories();
  }

  loadUserCategories() {
    if (this.myCategory !== null) {
      this.skillRequestService.getNearbyRequestsByCategory(this.myCategory as string).subscribe((requests: SkillRequest[]): void => {
        this.requests = requests;
        this.applyFilter();
      });
    } else {
      this.requests = [];
    }
  }

  loadRequests() {
    this.skillRequestService.getNearbyRequests().subscribe((requests: SkillRequest[]): void => {
      this.requests = requests;
      this.applyFilter();
    });
  }

  applyFilter() {
    const selectedCategory = this.filterForm.value.category;
    if (selectedCategory === 'all') {
      this.filteredRequests = this.requests;
    } else {
      this.filteredRequests = this.requests.filter(r => r.title === selectedCategory);
    }
  }

  openOfferForm(requestId: number) {
    this.selectedRequestId = requestId;
    this.offerForm.reset();
  }

  submitOffer() {
    if (!this.selectedRequestId) return;

    const selectedCategory = this.offerForm.value.skillCategory;
    console.log('Ponuda za request', this.selectedRequestId, 'sa vestinom', selectedCategory);
    alert('Razmena ponuđena!');
    this.selectedRequestId = null;
  }
}
