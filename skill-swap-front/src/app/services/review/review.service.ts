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

  getRatingForUser(reviewedUserId: number): Observable<RatingResponse> {
    return this.http.get<RatingResponse>(`${this.apiUrl}/user/${reviewedUserId}`);
  }

  create(reviewData: { rating: number, reviewedUserId: number }): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, reviewData);
  }

  update(reviewId: number, updateData: { rating: number }): Observable<Review> {
    return this.http.patch<Review>(`${this.apiUrl}/${reviewId}`, updateData);
  }

  getReviewsReceived(reviewedUserId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/received/${reviewedUserId}`);
  }
}