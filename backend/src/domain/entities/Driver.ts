import { v4 as uuidv4 } from 'uuid';
import { User } from './User';
import { Motorcycle } from './Motorcycle';
import { LicenseNumber } from '../values/users/LicenseNumber';
import { InvalidLicenseNumberError } from '../errors/users/InvalidLicenseNumberError';
import { DateOfBirth } from '../values/Driver/DateOfBirth';
import { InvalidDateOfBirthError } from '../errors/Driver/InvalidDateOfBirthError';

export class Driver {
  public licenseNumber: LicenseNumber;
  public experienceLevel?: string;
  public dateOfBirth: DateOfBirth;
  public clientId: string;
  public motorcycleId: string;
  
  public client: User;
  public motorcycle: Motorcycle;

  public constructor(
    public readonly driverId: string = uuidv4(),
    licenseNumber: LicenseNumber,
    experienceLevel: string,
    dateOfBirth: DateOfBirth,
    client: User,
    motorcycle: Motorcycle,
  ) {
    this.licenseNumber = licenseNumber;
    this.experienceLevel = experienceLevel;
    this.dateOfBirth = dateOfBirth;
    this.client = client;
    this.clientId = client.id;
    this.motorcycle = motorcycle;
    this.motorcycleId = motorcycle.id;
  }

  public static create(
    licenseNumber: string,
    experienceLevel: string,
    dateOfBirth: string,
    client: User,
    motorcycle: Motorcycle,
  ): Driver | InvalidLicenseNumberError | InvalidDateOfBirthError {
    const validLicenseNumber = LicenseNumber.from(licenseNumber);
    if (validLicenseNumber instanceof InvalidLicenseNumberError) {
      return validLicenseNumber;
    }

    const validDateOfBirth = DateOfBirth.from(dateOfBirth);
    if (validDateOfBirth instanceof InvalidDateOfBirthError) {
      return validDateOfBirth;
    }

    return new Driver(uuidv4(), validLicenseNumber, experienceLevel, validDateOfBirth, client, motorcycle);
  }

  public updateLicenseNumber(newLicenseNumber: string): InvalidLicenseNumberError | void {
    const validLicenseNumber = LicenseNumber.from(newLicenseNumber);
    if (validLicenseNumber instanceof InvalidLicenseNumberError) {
      return validLicenseNumber;
    }
    this.licenseNumber = validLicenseNumber;
  }

  public updateDateOfBirth(newDateOfBirth: string): InvalidDateOfBirthError | void {
    const validDateOfBirth = DateOfBirth.from(newDateOfBirth);
    if (validDateOfBirth instanceof InvalidDateOfBirthError) {
      return validDateOfBirth;
    }
    this.dateOfBirth = validDateOfBirth;
  }

  public updateExperienceLevel(newExperienceLevel: string) {
    this.experienceLevel = newExperienceLevel;
  }

  public getClientDetails() {
    return {
      username: this.client.username,
      email: this.client.email,
      phoneNumber: this.client.phoneNumber,
    };
  }

  public getMotorcycleDetails() {
    return {
      brand: this.motorcycle.brand,
      model: this.motorcycle.model,
      licensePlate: this.motorcycle.licensePlate,
    };
  }
}