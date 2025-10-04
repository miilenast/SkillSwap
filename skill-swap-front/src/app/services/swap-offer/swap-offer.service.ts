import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SwapOffer } from '../../models/swap-offer.model';

@Injectable({
  providedIn: 'root'
})
export class SwapOfferService {
  private apiUrl = 'http://localhost:3000/swap-offer';

  constructor(private http: HttpClient) {}

  create(offer: any): Observable<SwapOffer> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` });
    return this.http.post<SwapOffer>(this.apiUrl, offer, { headers });
  }

  getOffersByOffererId(offererId: number): Observable<SwapOffer[]> {
    if(!localStorage.getItem('token')) {
      throw new Error('User not authenticated');
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` });
    return this.http.get<SwapOffer[]>(`${this.apiUrl}/offerer/${offererId}`, { headers });
  }

  getAll(requestId: number): Observable<SwapOffer[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` });
    return this.http.get<SwapOffer[]>(`${this.apiUrl}/request/${requestId}`, { headers });
  }

  getOne(id: number): Observable<SwapOffer> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` });
    return this.http.get<SwapOffer>(`${this.apiUrl}/${id}`, { headers });
  }

  update(id: number, offer: Partial<SwapOffer>): Observable<SwapOffer> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` });
    return this.http.patch<SwapOffer>(`${this.apiUrl}/${id}`, offer, { headers });
  }

  delete(id: number): Observable<void> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` });
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}
