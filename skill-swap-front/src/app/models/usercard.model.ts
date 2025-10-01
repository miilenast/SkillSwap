import { Skill } from "./skill.model";

export interface UserCardData {
  id: number;
  firstName: string;
  lastName: string;
  profilePicture: string | null;
  phoneNumber: string;
  skills: Skill[];
}
