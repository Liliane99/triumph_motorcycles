import { v4 as uuidv4 } from 'uuid';
import { User } from './User'; 
import { Motorcycle } from './Motorcycle'; 
import { RentalReference } from '../values/Rental/rentalReference';
import { RentalDateInPastError } from '../errors/Rental/RentalDateInPastError'; 

export class Rental {
  public reference: RentalReference;
  public rentalDate: Date;
  public price: number;
  public clientId: string; 
  public motorcycleId: string; 
  public client: User; 
  public motorcycle: Motorcycle; 

  constructor(
    public readonly id: string = uuidv4(),
    reference: string,
    rentalDate: Date,
    price: number,
    client: User,
    motorcycle: Motorcycle
  ) {
    this.reference = new RentalReference(reference);
    this.rentalDate = rentalDate;
    this.price = price;
    this.client = client;
    this.clientId = client.id; 
    this.motorcycle = motorcycle;
    this.motorcycleId = motorcycle.id; 
  }

  private validateRentalDate(rentalDate: Date): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);  
  
    if (rentalDate < today) {
      throw new RentalDateInPastError();
    }
  }

  updateRentalDate(newDate: Date | string) {
    const parsedDate = newDate instanceof Date ? newDate : new Date(newDate);
    this.validateRentalDate(parsedDate);
    this.rentalDate = parsedDate;
  }

  updateReference(newReference: string) {
    this.reference.updateReference(newReference);
  }

  getReference(): string {
    return this.reference.getReference();
  }

  updatePrice(price: number) {
    this.price = price;
  }

  getMotorcycleDetails() {
    return {
      brand: this.motorcycle.brand,
      model: this.motorcycle.model,
      licensePlate: this.motorcycle.licensePlate,
    };
  }

  getClientDetails() {
    return {
      username: this.client.username,
      email: this.client.email,
      phoneNumber: this.client.phoneNumber,
    };
  }
}
