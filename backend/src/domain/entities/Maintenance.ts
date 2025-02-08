import { v4 as uuidv4 } from 'uuid';
import { Motorcycle } from './Motorcycle';
import { Part } from './Part';
import { MaintenanceReference } from '../values/Maintenance/maintenanceReference';
import { MaintenanceReferenceAlreadyExistsError } from '../errors/Maintenance/MaintenanceReferenceError';
import { MaintenanceDateInPastError } from '../errors/Maintenance/MaintenanceDateInPastError';

export class Maintenance {
  public reference: MaintenanceReference;
  public date: Date;
  public technician: string; 
  public recommendation: string;
  public pricePartTotal: number;
  public priceLabour: number;
  public priceTotal: number;
  public motorcycleId: string;
  public partId: string;
  public motorcycle: Motorcycle;
  public part: Part;

  constructor(
    public readonly id: string = uuidv4(),
    reference: string,
    date: Date,
    technician: string, 
    recommendation: string,
    pricePartTotal: number,
    priceLabour: number,
    motorcycle: Motorcycle,
    part: Part
  ) {
    this.validateDate(date);
    this.validateReference(reference);

    this.reference = new MaintenanceReference(reference);
    this.date = date;
    this.technician = technician; 
    this.recommendation = recommendation;
    this.pricePartTotal = pricePartTotal;
    this.priceLabour = priceLabour;
    this.priceTotal = pricePartTotal + priceLabour;
    this.motorcycle = motorcycle;
    this.motorcycleId = motorcycle.id;
    this.part = part;
    this.partId = part.id;
  }

  private validateDate(date: Date): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      throw new MaintenanceDateInPastError();
    }
  }

  private validateReference(reference: string): void {
    if (!reference || reference.trim() === '') {
      throw new MaintenanceReferenceAlreadyExistsError(reference);
    }
  }

  updateMaintenanceDetails(
    newDate: Date,
    newTechnician: string,
    newRecommendation: string,
    newPricePartTotal: number,
    newPriceLabour: number
  ) {
    this.validateDate(newDate);

    this.date = newDate;
    this.technician = newTechnician; 
    this.recommendation = newRecommendation;
    this.pricePartTotal = newPricePartTotal;
    this.priceLabour = newPriceLabour;
    this.priceTotal = newPricePartTotal + newPriceLabour;
  }
}
