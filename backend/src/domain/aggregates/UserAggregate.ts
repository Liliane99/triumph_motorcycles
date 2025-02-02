import { Aggregate } from "./Aggregate";
import { User } from "../entities/User";
import { UserCreatedEvent } from "../events/users/UserCreatedEvent";
import { UserUpdatedEvent } from "../events/users/UserUpdatedEvent";
import { UserDeletedEvent } from "../events/users/UserDeletedEvent";
import { Username } from "../values/users/Username";
import { Email } from "../values/users/Email";

export class UserAggregate extends Aggregate<User> {
  private user: User | null = null; 

  apply(event: UserCreatedEvent | UserUpdatedEvent | UserDeletedEvent) {
    if (event.type === "USER_CREATED") {
      this.user = new User(
        event.data.id,
        new Username(event.data.username), 
        new Email(event.data.email),
        "", 
        event.data.role as "manager" | "client" | "admin",
        event.data.createdBy,
        event.data.createdBy,
        event.data.createdAt instanceof Date ? event.data.createdAt : new Date(event.data.createdAt),
        event.data.createdAt instanceof Date ? event.data.createdAt : new Date(event.data.createdAt), 
        event.data.phoneNumber ?? "",
        event.data.licenseNumber ?? "",
        event.data.experienceLevel ?? ""
      );
    } else if (event.type === "USER_UPDATED") {
      if (!this.user) {
        throw new Error("UserAggregate is not initialized before update.");
      }

      this.user = new User(
        this.user.id,
        event.data.username ? new Username(event.data.username) : this.user.username,
        event.data.email ? new Email(event.data.email) : this.user.email,
        this.user.password,
        event.data.role ? event.data.role as "manager" | "client" | "admin" : this.user.role,
        this.user.createdBy,
        event.data.updatedBy || this.user.updatedBy,
        this.user.createdAt,
        event.data.updatedAt instanceof Date ? event.data.updatedAt : new Date(event.data.updatedAt), 
        event.data.phoneNumber ?? this.user.phoneNumber,
        event.data.licenseNumber ?? this.user.licenseNumber,
        event.data.experienceLevel ?? this.user.experienceLevel
      );
    }
  }
}
