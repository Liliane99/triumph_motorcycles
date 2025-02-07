import { v4 as uuidv4 } from 'uuid';
import { User } from './User';
import { Motorcycle } from './Motorcycle';

export class Driver {
  public licenseNumber: string;
  public experienceLevel?: string;
  public dateOfBirth: Date;
  public clientId: string;
  public motorcycleId: string;
  
  public client: User;
  public motorcycle: Motorcycle;

  constructor(
    public readonly driverId: string = uuidv4(),
    licenseNumber: string,
    experienceLevel: string,
    dateOfBirth: Date,
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

  updateLicenseNumber(newLicenseNumber: string) {
    this.licenseNumber = newLicenseNumber;
  }

  updateExperienceLevel(newExperienceLevel: string) {
    this.experienceLevel = newExperienceLevel;
  }

  getClientDetails() {
    return {
      username: this.client.username,
      email: this.client.email,
      phoneNumber: this.client.phoneNumber,
    };
  }

  getMotorcycleDetails() {
    return {
      brand: this.motorcycle.brand,
      model: this.motorcycle.model,
      licensePlate: this.motorcycle.licensePlate,
    };
  }
}
