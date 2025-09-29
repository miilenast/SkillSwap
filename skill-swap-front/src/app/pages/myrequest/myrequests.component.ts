import { Component, OnInit } from '@angular/core';
import { SkillRequest } from '../../models/request.model';
import { SkillRequestService } from '../../services/request/skill-request.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SkillRequestFormComponent } from './skill-request-form/skill-request-form.component';

@Component({
  selector: 'app-my-requests',
  templateUrl: './myrequests.component.html',
  styleUrls: ['./myrequests.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, SkillRequestFormComponent]
})

export class MyRequestsComponent implements OnInit {
  requests: SkillRequest[] = [];
  loading = true;
  showForm: boolean = false;

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
        this.requests = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Greška pri učitavanju zahteva', err);
        this.loading = false;
        }
    });
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
    const obs = this.skillRequestService.create(newRequest);
    obs.subscribe({next: (data) => {
      this.requests = [...this.requests, data];
    }});
    this.showForm = false;
  }
}
