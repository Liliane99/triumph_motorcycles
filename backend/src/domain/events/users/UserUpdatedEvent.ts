import { EventShape } from "../EventShape";

export interface UserUpdatedEvent extends EventShape<"USER_UPDATED", 1, {
  id: string;
  username?: string;
  email?: string;
  role?: string;
  updatedAt: Date;
  updatedBy: string;
  phoneNumber?: string; 
  licenseNumber?: string;
  experienceLevel?: string;
}> {}
