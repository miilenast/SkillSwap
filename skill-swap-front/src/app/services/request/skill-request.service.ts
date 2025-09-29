import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SkillRequest } from '../../models/request.model';

@Injectable({
  providedIn: 'root'
})
export class SkillRequestService {
  private apiUrl = 'http://localhost:3000/skill-request';

  constructor(private http: HttpClient) {}

  getAll(): Observable<SkillRequest[]> {
    let token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token nije pronađen u localStorage.');
    }
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<SkillRequest[]>(this.apiUrl, { headers });
  }

  getOne(id: number): Observable<SkillRequest> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('token')}` });
    return this.http.get<SkillRequest>(`${this.apiUrl}/${id}`, { headers });
  }

  create(request: Partial<SkillRequest>): Observable<SkillRequest> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` });
    return this.http.post<SkillRequest>(this.apiUrl, request, { headers });
  }

  delete(id: number): Observable<void> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('token')}` });
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

  getMyRequests(): Observable<SkillRequest[]> {
    let token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<SkillRequest[]>(`${this.apiUrl}/my-requests`, { headers });
  }

  getNearbyRequests(): Observable<SkillRequest[]> {
    const userId = localStorage.getItem('userId');
    return this.http.get<SkillRequest[]>(`${this.apiUrl}/nearby/${userId}`);
  }

  getNearbyRequestsByCategory(category: string): Observable<SkillRequest[]> {
    const userId = localStorage.getItem('userId');
    return this.http.get<SkillRequest[]>(`${this.apiUrl}/nearby/${userId}/category/${category}`);
  }
}
