export class CreateUserDto {
    username!: string;
    email!: string;
    password!: string;
    role!: "manager" | "client" | "admin";
    phoneNumber?: string;
    licenseNumber?: string;
    experienceLevel?: string;
}
  