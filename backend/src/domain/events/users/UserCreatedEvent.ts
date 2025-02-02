import { EventShape } from "../EventShape";

export interface UserCreatedEvent extends EventShape<"USER_CREATED", 1, {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: Date;
  createdBy: string;
  phoneNumber?: string;  
  licenseNumber?: string;
  experienceLevel?: string;
}> {}
