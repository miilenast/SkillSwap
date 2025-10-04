import { Component, OnInit } from '@angular/core';
import { SkillRequest } from '../../models/request.model';
import { SkillRequestService } from '../../services/request/skill-request.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SkillRequestFormComponent } from './skill-request-form/skill-request-form.component';
import { SkillRequestStatus } from '../../models/enums.model';

@Component({
  selector: 'app-my-requests',
  templateUrl: './myrequests.component.html',
  styleUrls: ['./myrequests.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, SkillRequestFormComponent]
})

export class MyRequestsComponent implements OnInit {
  allRequests: SkillRequest[] = [];
  requests: SkillRequest[] = [];
  loading = true;
  showForm: boolean = false;
  selectedStatusUnapplied: string | null = null;
  selectedStatusApplied: string | null = null;
  requestStatusValues: string[] = Object.values(SkillRequestStatus);
 
  constructor(
    private skillRequestService: SkillRequestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.skillRequestService.getMyRequests().subscribe({
      next: (res) => {
        this.allRequests = res;
        this.loading = false;
        this.applyFilterAndSort();
      },
      error: (err) => {
        console.error('Greška pri učitavanju zahteva', err);
        this.loading = false;
        }
    });
  }

  applyFilterAndSort() {
    let listToProcess = this.allRequests;
    if(this.selectedStatusApplied) {
      listToProcess = listToProcess.filter(r => r.status === this.selectedStatusApplied);
    }
    this.requests = this.applySort(listToProcess);
  }

  applySort(list: SkillRequest[]): SkillRequest[] {
    const statusOrder = [SkillRequestStatus.ACCEPTED, SkillRequestStatus.PENDING, SkillRequestStatus.DONE];
    const sortReq = (a: SkillRequest, b: SkillRequest) => {
      const indexA = statusOrder.indexOf(a.status);
      const indexB = statusOrder.indexOf(b.status);

      if(indexA === -1 && indexB !== -1) return 1;
      if(indexA !== -1 && indexB === -1) return -1;
      if(indexA === -1 && indexB === -1) return 0;

      return indexA - indexB;
    };

    return [...list].sort(sortReq);
  }

  filterByStatus() {
    this.selectedStatusApplied = this.selectedStatusUnapplied;
    this.applyFilterAndSort();
  }

  clearStatusFilter() {
    this.selectedStatusApplied = null;
    this.selectedStatusUnapplied = null;
    this.applyFilterAndSort();
  }

  viewOffers(requestId: number): void {
    this.router.navigate(['/request-offers', requestId]);
  }

  addNewRequest(): void {
    this.showForm = true;
  }

  cancelRequest() {
    this.showForm = false;
  }

  handleNewRequest(newRequest: SkillRequest) {
    this.skillRequestService.create(newRequest).subscribe({
      next: (data) => {
        this.requests = [...this.requests, data];
        this.showForm = false;
      },
      error: (err) => {
        console.error('Greška pri kreiranju zahteva', err);
      }
    });
  }
}
