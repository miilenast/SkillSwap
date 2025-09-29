import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SwapOffer } from '../../models/swap-offer.model';

@Injectable({
  providedIn: 'root'
})
export class SwapOfferService {
  private apiUrl = 'http://localhost:3000/swap-offer';

  constructor(private http: HttpClient) {}

  getAll(): Observable<SwapOffer[]> {
    return this.http.get<SwapOffer[]>(this.apiUrl);
  }

  getOne(id: number): Observable<SwapOffer> {
    return this.http.get<SwapOffer>(`${this.apiUrl}/${id}`);
  }

  create(offer: Partial<SwapOffer>): Observable<SwapOffer> {
    return this.http.post<SwapOffer>(this.apiUrl, offer);
  }

  update(id: number, offer: Partial<SwapOffer>): Observable<SwapOffer> {
    return this.http.patch<SwapOffer>(`${this.apiUrl}/${id}`, offer);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
