import { PrismaClient } from "@prisma/client";
import { Moto } from "../../../domain/entities/Motorcycle";
import { MotoRepository } from "../../../domain/repositories/MotorcycleRepository";

const prisma = new PrismaClient();

export class PrismaMotoRepository implements MotoRepository {
  async create(moto: Moto): Promise<Moto> {
    const newMoto = await prisma.moto.create({
      data: {
        id: moto.id,
        brand: moto.brand,
        model: moto.model,
        year: moto.year,
        licensePlate: moto.licensePlate,
        kilometers: moto.kilometers,
      },
    });
    return newMoto;
  }

  async findAll(): Promise<Moto[]> {
    return await prisma.moto.findMany();
  }
}
