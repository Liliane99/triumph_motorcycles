import { MotorcycleRepository } from '../../../../domain/repositories/MotorcycleRepository';
import { Motorcycle } from '../../../../domain/entities/Motorcycle';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MotorcycleRepositoryImpl implements MotorcycleRepository {
  async save(motorcycle: Motorcycle): Promise<Motorcycle> {
    console.log("Motorcycle to save:", motorcycle);
    
    const updatedMotorcycle = await prisma.motorcycle.upsert({
      where: { licensePlate: motorcycle.licensePlate  },  
      update: {
        brand: motorcycle.brand,
        model: motorcycle.model,
        date: motorcycle.date,
        licensePlate: motorcycle.licensePlate, 
        kilometers: motorcycle.kilometers,
        warranty: motorcycle.warranty,
        maintenanceInterval: motorcycle.maintenanceInterval
      },
      create: {
        id: motorcycle.id,
        brand: motorcycle.brand,
        model: motorcycle.model,
        date: motorcycle.date,
        licensePlate: motorcycle.licensePlate,
        kilometers: motorcycle.kilometers,
        warranty: motorcycle.warranty,
        maintenanceInterval: motorcycle.maintenanceInterval
      }
    });
  
    return updatedMotorcycle;
  }

  async findById(id: string): Promise<Motorcycle | null> {
    return prisma.motorcycle.findUnique({
      where: { id },
    });
  }

  async getAll(): Promise<Motorcycle[]> {
    return prisma.motorcycle.findMany(); 
  }

  async delete(id: string): Promise<void> {
    await prisma.motorcycle.delete({
      where: { id },
    });
  }
}
