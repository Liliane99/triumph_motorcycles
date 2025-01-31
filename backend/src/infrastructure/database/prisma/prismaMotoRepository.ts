import { PrismaClient } from "@prisma/client";
import { IMotorcycleRepository } from "../../../application/ports/repositories/IMotorcycleRepository";
import { Moto } from "../../../domain/entities/Motorcycle";

const prisma = new PrismaClient();

export class PrismaMotorcycleRepository implements IMotorcycleRepository {
  async save(motorcycle: Moto): Promise<void> {
    await prisma.motorcycle.create({ data: { ...motorcycle } });
  }

  async update(licensePlate: string, data: Partial<Moto>): Promise<void> {
    await prisma.motorcycle.update({ where: { licensePlate }, data });
  }

  async delete(licensePlate: string): Promise<void> {
    await prisma.motorcycle.delete({ where: { licensePlate } });
  }

  async findByLicensePlate(licensePlate: string): Promise<Moto | null> {
    return prisma.motorcycle.findUnique({ where: { licensePlate } });
  }

  async findAll(): Promise<Moto[]> {
    return prisma.motorcycle.findMany();
  }
}
