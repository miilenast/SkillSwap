import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../../models/review.model';

export interface RatingResponse {
  rating: number; 
  reviewId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:3000/review';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token nije pronađen u localStorage.');
    }
    return new HttpHeaders({ 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
    });
  }

  getRatingForUser(reviewedUserId: number): Observable<RatingResponse> {
    const headers = this.getAuthHeaders();
    return this.http.get<RatingResponse>(`${this.apiUrl}/user/${reviewedUserId}`, { headers });
  }

  create(reviewData: { rating: number, reviewedUserId: number }): Observable<Review> {
    const headers = this.getAuthHeaders();
    return this.http.post<Review>(this.apiUrl, reviewData, { headers });
  }

  update(reviewId: number, updateData: { rating: number }): Observable<Review> {
    const headers = this.getAuthHeaders();
    return this.http.patch<Review>(`${this.apiUrl}/${reviewId}`, updateData, { headers });
  }

  getReviewsReceived(reviewedUserId: number): Observable<Review[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Review[]>(`${this.apiUrl}/received/${reviewedUserId}`, { headers });
  }
}