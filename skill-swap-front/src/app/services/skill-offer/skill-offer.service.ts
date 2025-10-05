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
    if (!userId) {
      console.error('No userId found');
      return new Observable<Skill[]>(observer => {
        observer.next([]);
        observer.complete();
      });
    }

    return this.http.get<Skill[]>(`${this.apiUrl}/skill-offer?userId=${userId}`);
  }

  addSkill(skill: Skill): Observable<Skill> {
    return this.http.post<Skill>(`${this.apiUrl}/skill-offer`, skill);
  }

  editSkill(skill: Skill): Observable<Skill> {
    return this.http.patch<Skill>(`${this.apiUrl}/skill-offer/${skill.id}`, skill);
  }

  deleteSkill(skillId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/skill-offer/${skillId}`);
  }
}
