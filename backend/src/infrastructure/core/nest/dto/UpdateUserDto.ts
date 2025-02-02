export class UpdateUserDto {
    username?: string;
    email?: string;
    role?: "manager" | "client" | "admin";
    phoneNumber?: string;
    licenseNumber?: string;
    experienceLevel?: string;
}
  