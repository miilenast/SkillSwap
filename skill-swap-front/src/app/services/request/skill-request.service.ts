import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { SkillRequest } from '../../models/request.model';

@Injectable({
  providedIn: 'root'
})
export class SkillRequestService {
  private apiUrl = 'http://localhost:3000/skill-request';

  constructor(private http: HttpClient) {}

  update(id: number, updateDto: Partial<SkillRequest>): Observable<SkillRequest> {
    return this.http.patch<SkillRequest>(`${this.apiUrl}/${id}`, updateDto);
  }

  getAll(): Observable<SkillRequest[]> {
    return this.http.get<SkillRequest[]>(this.apiUrl);
  }

  getOne(id: number): Observable<SkillRequest> {
    return this.http.get<SkillRequest>(`${this.apiUrl}/${id}`);
  }

  create(request: Partial<SkillRequest>): Observable<SkillRequest> {
    return this.http.post<SkillRequest>(this.apiUrl, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getMyRequests(): Observable<SkillRequest[]> {
    return this.http.get<SkillRequest[]>(`${this.apiUrl}/my-requests`);
  }

  getNearbyRequests(): Observable<SkillRequest[]> {
    const userId = localStorage.getItem('userId');
    if(!userId) {
      console.error('UserId nije u localStorage!');
      return of([]);
    }
    return this.http.get<SkillRequest[]>(`${this.apiUrl}/nearby/${userId}`);
  }

  getNearbyRequestsByCategory(category: string): Observable<SkillRequest[]> {
    const userId = localStorage.getItem('userId');
    return this.http.get<SkillRequest[]>(`${this.apiUrl}/nearby/${userId}/category/${category}`);
  }
}
