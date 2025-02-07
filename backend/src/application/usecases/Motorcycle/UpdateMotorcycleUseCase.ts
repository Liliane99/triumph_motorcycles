import { MotorcycleRepository } from "../../ports/repositories/MotorcycleRepository";
import { UpdateMotorcycleCommand } from "../../commands/definitions/Motorcycle/UpdateMotorcycleCommand";
import { IEmailService } from "../../ports/services/IEmailService"; 
import { IUserRepository } from "../../ports/repositories/UserRepository"; 

export class UpdateMotorcycleUseCase {
  constructor(
    private readonly motorcycleRepository: MotorcycleRepository,
    private readonly emailService: IEmailService,
    private readonly userRepository: IUserRepository 
  ) {}

  async execute(command: UpdateMotorcycleCommand) {
    const motorcycle = await this.motorcycleRepository.findById(command.id);
    if (!motorcycle) {
      throw new Error("Motorcycle not found");
    }

    const { brand, model, purchaseDate, licensePlate, kilometers, warrantyDate, maintenanceInterval, userId } = command;

    if (brand) motorcycle.updateBrand(brand);
    if (model) motorcycle.updateModel(model);
    if (purchaseDate) motorcycle.updatePurchaseDate(purchaseDate);
    if (licensePlate) motorcycle.updateLicensePlate(licensePlate);
    if (kilometers) motorcycle.updateKilometers(kilometers);
    if (warrantyDate) motorcycle.updateWarrantyDate(warrantyDate);
    if (maintenanceInterval) motorcycle.updateMaintenanceInterval(maintenanceInterval);
    if (userId) motorcycle.updateUserId(userId);

   
    if (kilometers) {
      const currentKilometers = motorcycle.getKilometers().get(); 
      const maintenanceIntervalValue = motorcycle.getMaintenanceInterval().get();
      console.log("Current KM:", currentKilometers, "Maintenance Interval:", maintenanceIntervalValue);
    
      if (currentKilometers >= maintenanceIntervalValue) {
        console.log("Maintenance email should be sent!");
    
        const user = await this.userRepository.getUserById(motorcycle.getOwnerId());
        if (!user) {
          throw new Error("User not found");
        }
    
        console.log("Sending email to:", user.email.value);
    
        await this.emailService.sendMaintenanceAlert(
          motorcycle.id,
          currentKilometers,
          maintenanceIntervalValue,
          user.email.value 
        );
    
        const newMaintenanceInterval = maintenanceIntervalValue * 2;
        motorcycle.updateMaintenanceInterval(newMaintenanceInterval);
      }
    }
    

    
    return this.motorcycleRepository.save(motorcycle);
  }
}
