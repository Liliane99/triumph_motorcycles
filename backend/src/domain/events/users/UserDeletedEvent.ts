import { EventShape } from "../EventShape";

export interface UserDeletedEvent extends EventShape<"USER_DELETED", 1, {
  id: string;
  deletedAt: Date;
  deletedBy: string;
}> {}
