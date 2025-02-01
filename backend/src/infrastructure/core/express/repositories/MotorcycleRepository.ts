import { MotorcycleRepository } from '../../../../domain/repositories/MotorcycleRepository';
import { Motorcycle } from '../../../../domain/entities/Motorcycle';
import { PrismaClient } from '@prisma/client';
import { Brand } from '../../../../domain/values/Motorcycle/motorcycleBrand';
import { Model } from '../../../../domain/values/Motorcycle/motorcycleModel';
import { LicensePlate } from '../../../../domain/values/Motorcycle/motorcycleLicensePlate';
import { Kilometers } from '../../../../domain/values/Motorcycle/motorcycleKilometers';
import { MaintenanceInterval } from '../../../../domain/values/Motorcycle/motorcycleMaintenanceInterval';

const prisma = new PrismaClient();

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
      new MaintenanceInterval(prismaMotorcycle.maintenanceInterval).get()
    );
  }

  async save(motorcycle: Motorcycle): Promise<Motorcycle> {
    console.log("Motorcycle to save:", motorcycle);

    const updatedMotorcycle = await prisma.motorcycle.upsert({
      where: { licensePlate: motorcycle.licensePlate.get() },  
      update: {
        brand: motorcycle.brand.get(),
        model: motorcycle.model.get(),
        purchaseDate: motorcycle.purchaseDate,
        licensePlate: motorcycle.licensePlate.get(),
        kilometers: motorcycle.kilometers.get(),
        warrantyDate: motorcycle.warrantyDate,
        maintenanceInterval: motorcycle.maintenanceInterval.get(),
      },
      create: {
        id: motorcycle.id,
        brand: motorcycle.brand.get(),
        model: motorcycle.model.get(),
        purchaseDate: motorcycle.purchaseDate,
        licensePlate: motorcycle.licensePlate.get(),
        kilometers: motorcycle.kilometers.get(),
        warrantyDate: motorcycle.warrantyDate,
        maintenanceInterval: motorcycle.maintenanceInterval.get(),
      }
    });

    return this.mapToMotorcycle(updatedMotorcycle); 
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
