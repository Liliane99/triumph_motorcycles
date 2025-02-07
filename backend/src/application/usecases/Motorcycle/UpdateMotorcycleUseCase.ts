import { MotorcycleRepository } from "../../ports/repositories/MotorcycleRepository";
import { UpdateMotorcycleCommand } from "../../commands/definitions/Motorcycle/UpdateMotorcycleCommand";

export class UpdateMotorcycleUseCase {
  constructor(private readonly motorcycleRepository: MotorcycleRepository) {}

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

    

    return this.motorcycleRepository.save(motorcycle);
  }
}
