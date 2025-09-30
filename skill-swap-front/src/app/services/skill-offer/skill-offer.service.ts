import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Skill } from '../../models/skill.model';

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getUserSkills(userId: string): Observable<Skill[]> {
    const token = localStorage.getItem('token');

    if (!token || !userId) {
      console.error('No token or userId found');
      return new Observable<Skill[]>(observer => {
        observer.next([]);
        observer.complete();
      });
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Skill[]>(`${this.apiUrl}/skill-offer?userId=${userId}`, { headers });
  }

  addSkill(skill: Skill, token: string): Observable<Skill> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` });
    return this.http.post<Skill>(`${this.apiUrl}/skill-offer`, skill, { headers });
  }

  editSkill(skill: Skill, token: string): Observable<Skill> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` });
    return this.http.patch<Skill>(`${this.apiUrl}/skill-offer/${skill.id}`, skill, { headers });
  }

  deleteSkill(skillId: number, token: string): Observable<void> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.delete<void>(`${this.apiUrl}/skill-offer/${skillId}`, { headers });
  }
}
