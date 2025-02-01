import { Brand } from "../values/Motorcycle/motorcycleBrand";
import { Model } from "../values/Motorcycle/motorcycleModel";
import { LicensePlate } from "../values/Motorcycle/motorcycleLicensePlate";
import { Kilometers } from "../values/Motorcycle/motorcycleKilometers";
import { MaintenanceInterval } from "../values/Motorcycle/motorcycleMaintenanceInterval";

export class Motorcycle {
  public brand: Brand;
  public model: Model;
  public purchaseDate: Date;
  public licensePlate: LicensePlate;
  public kilometers: Kilometers;
  public warrantyDate: Date;
  public maintenanceInterval: MaintenanceInterval;

  constructor(
    public readonly id: string,
    brand: string,
    model: string,
    purchaseDate: Date,
    licensePlate: string,
    kilometers: number,
    warrantyDate: Date,
    maintenanceInterval: number
  ) {
    
    this.brand = new Brand(brand);
    this.model = new Model(model);
    this.licensePlate = new LicensePlate(licensePlate);
    this.kilometers = new Kilometers(kilometers);
    this.maintenanceInterval = new MaintenanceInterval(maintenanceInterval);

    
    this.purchaseDate = purchaseDate;
    this.warrantyDate = warrantyDate;
    this.validateDates();
  }

  private validateDates(): void {
    
    if (this.warrantyDate <= this.purchaseDate) {
      throw new Error("Warranty date must be after the purchase date.");
    }
  }

  
  updateBrand(brand: string) {
    this.brand = new Brand(brand);
  }

  updateModel(model: string) {
    this.model = new Model(model);
  }

  updatePurchaseDate(date: Date) {
    this.purchaseDate = date;
    this.validateDates(); 
  }

  updateLicensePlate(licensePlate: string) {
    this.licensePlate = new LicensePlate(licensePlate);
  }

  updateKilometers(kilometers: number) {
    this.kilometers = new Kilometers(kilometers);
  }

  updateWarrantyDate(warranty: Date) {
    this.warrantyDate = warranty;
    this.validateDates(); 
  }

  updateMaintenanceInterval(maintenanceInterval: number) {
    this.maintenanceInterval = new MaintenanceInterval(maintenanceInterval);
  }
}
