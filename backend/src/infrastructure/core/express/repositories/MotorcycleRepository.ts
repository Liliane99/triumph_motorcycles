import { Injectable } from "@nestjs/common";
import { MotorcycleRepository } from '../../../../application/ports/repositories/MotorcycleRepository';
import { Motorcycle } from '../../../../domain/entities/Motorcycle';
import { PrismaClient } from '@prisma/client';
import { Brand } from '../../../../domain/values/Motorcycle/motorcycleBrand';
import { Model } from '../../../../domain/values/Motorcycle/motorcycleModel';
import { LicensePlate } from '../../../../domain/values/Motorcycle/motorcycleLicensePlate';
import { Kilometers } from '../../../../domain/values/Motorcycle/motorcycleKilometers';
import { MaintenanceInterval } from '../../../../domain/values/Motorcycle/motorcycleMaintenanceInterval';
import { MotorWithSimilarLicensePlateError } from "../../../../domain/errors/Motorcycle/motorWithSimilarLicensePlate";

const prisma = new PrismaClient();

@Injectable()
export class MotorcycleRepositoryImpl implements MotorcycleRepository {
  
  private mapToMotorcycle(prismaMotorcycle: any): Motorcycle {
    return new Motorcycle(
      prismaMotorcycle.id,
      new Brand(prismaMotorcycle.brand).get(),
      new Model(prismaMotorcycle.model).get(),
      prismaMotorcycle.purchaseDate,
      new LicensePlate(prismaMotorcycle.licensePlate).get(),
      new Kilometers(prismaMotorcycle.kilometers).get(),
      prismaMotorcycle.warrantyDate,
      new MaintenanceInterval(prismaMotorcycle.maintenanceInterval).get(),
      prismaMotorcycle.ownerId,
      prismaMotorcycle.userId
    );
  }

  async save(motorcycle: Motorcycle): Promise<Motorcycle> {
    
  
    const existingMotorcycle = await prisma.motorcycle.findUnique({
      where: { licensePlate: motorcycle.licensePlate.get() },
    });
  
    if (existingMotorcycle && existingMotorcycle.id !== motorcycle.id) {
      throw new MotorWithSimilarLicensePlateError(motorcycle.licensePlate.get());
    }
  
    const formattedPurchaseDate = new Date(motorcycle.purchaseDate);
    const formattedWarrantyDate = new Date(motorcycle.warrantyDate);
  
    if (existingMotorcycle) {
      const updatedMotorcycle = await prisma.motorcycle.update({
        where: { id: motorcycle.id },
        data: {
          brand: motorcycle.brand.get(),
          model: motorcycle.model.get(),
          purchaseDate: formattedPurchaseDate,  
          licensePlate: motorcycle.licensePlate.get(),
          kilometers: motorcycle.kilometers.get(),
          warrantyDate: formattedWarrantyDate, 
          maintenanceInterval: motorcycle.maintenanceInterval.get(),
          ownerId: motorcycle.ownerId,
          updatedBy: motorcycle.updatedBy,
        },
      });
  
      return this.mapToMotorcycle(updatedMotorcycle);
    }
  
    const newMotorcycle = await prisma.motorcycle.create({
      data: {
        brand: motorcycle.brand.get(),
        model: motorcycle.model.get(),
        purchaseDate: formattedPurchaseDate,  
        licensePlate: motorcycle.licensePlate.get(),
        kilometers: motorcycle.kilometers.get(),
        warrantyDate: formattedWarrantyDate, 
        maintenanceInterval: motorcycle.maintenanceInterval.get(),
        ownerId: motorcycle.ownerId,
        createdBy: motorcycle.createdBy,
      },
    });
  
    return this.mapToMotorcycle(newMotorcycle);
  }
  
  

  async findById(id: string): Promise<Motorcycle | null> {
    const prismaMotorcycle = await prisma.motorcycle.findUnique({
      where: { id },
    });

    if (!prismaMotorcycle) {
      return null;
    }

    return this.mapToMotorcycle(prismaMotorcycle); 
  }

  async getAll(): Promise<Motorcycle[]> {
    const prismaMotorcycles = await prisma.motorcycle.findMany();
    return prismaMotorcycles.map(this.mapToMotorcycle); 
  }

  async delete(id: string): Promise<void> {
    await prisma.motorcycle.delete({
      where: { id },
    });
  }
}
