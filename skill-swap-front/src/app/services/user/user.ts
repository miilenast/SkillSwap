import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class User {
  id: number | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  profilePicture: string | undefined;
  skills: never[] | undefined;
  phoneNumber: string | undefined;
}
