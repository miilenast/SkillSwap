import type { Skill } from "./Skill";

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profilePicture: string;
  skills: string[];
  address?: string;
  latitude?: number;
  longitude?: number;
  offers?: Skill[];
}