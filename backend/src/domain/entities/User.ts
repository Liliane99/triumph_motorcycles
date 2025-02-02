import { Email } from "../values/users/Email";
import { Username } from "../values/users/Username";
import { Password } from "../values/users/Password";
import { Role } from "../values/users/Role";
import { PhoneNumber } from "../values/users/PhoneNumber";
import { LicenseNumber } from "../values/users/LicenseNumber";

export class User {
  constructor(
    public readonly id: string,
    public readonly username: Username,
    public readonly email: Email,
    public readonly password: Password,
    public readonly role: Role,
    public readonly createdBy: string,
    public readonly updatedBy: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly phoneNumber?: PhoneNumber,
    public readonly licenseNumber?: LicenseNumber,
    public readonly experienceLevel?: string
  ) {}

  private static validateFields(
    username: string,
    email: string,
    password?: string,
    role?: string,
    phoneNumber?: string,
    licenseNumber?: string
  ): {
    username: Username | Error;
    email: Email | Error;
    password?: Password | Error;
    role?: Role | Error;
    phoneNumber?: PhoneNumber | Error;
    licenseNumber?: LicenseNumber | Error;
  } {
    return {
      username: Username.from(username),
      email: Email.from(email),
      password: password ? Password.from(password) : undefined,
      role: role ? Role.from(role) : undefined,
      phoneNumber: phoneNumber ? PhoneNumber.from(phoneNumber) : undefined,
      licenseNumber: licenseNumber ? LicenseNumber.from(licenseNumber) : undefined
    };
  }

  static create(
    id: string,
    username: string,
    email: string,
    password: string,
    role: string,
    createdBy: string,
    phoneNumber?: string,
    licenseNumber?: string,
    experienceLevel?: string
  ): User | Error {
    const { username: validUsername, email: validEmail, password: validPassword, role: validRole, phoneNumber: validPhoneNumber, licenseNumber: validLicenseNumber } = this.validateFields(username, email, password, role, phoneNumber, licenseNumber);

    if (validUsername instanceof Error) return validUsername;
    if (validEmail instanceof Error) return validEmail;
    if (validPassword instanceof Error) return validPassword;
    if (validRole instanceof Error) return validRole;
    if (validPhoneNumber instanceof Error) return validPhoneNumber;
    if (validLicenseNumber instanceof Error) return validLicenseNumber;

    return new User(
      id,
      validUsername,
      validEmail,
      validPassword!,
      validRole!,
      createdBy,
      createdBy,
      new Date(),
      new Date(),
      validPhoneNumber,
      validLicenseNumber,
      experienceLevel
    );
  }

  update(
    username?: string,
    email?: string,
    role?: string,
    updatedBy?: string,
    phoneNumber?: string,
    licenseNumber?: string,
    experienceLevel?: string
  ): User | Error {
    const { username: validUsername, email: validEmail, role: validRole, phoneNumber: validPhoneNumber, licenseNumber: validLicenseNumber } = User.validateFields(
      username ?? this.username.value,
      email ?? this.email.value,
      undefined,
      role ?? this.role.value,
      phoneNumber,
      licenseNumber
    );

    if (validUsername instanceof Error) return validUsername;
    if (validEmail instanceof Error) return validEmail;
    if (validRole instanceof Error) return validRole;
    if (validPhoneNumber instanceof Error) return validPhoneNumber;
    if (validLicenseNumber instanceof Error) return validLicenseNumber;

    return new User(
      this.id,
      validUsername,
      validEmail,
      this.password,
      validRole!,
      this.createdBy,
      updatedBy ?? this.updatedBy,
      this.createdAt,
      new Date(),
      validPhoneNumber,
      validLicenseNumber,
      experienceLevel
    );
  }
}
