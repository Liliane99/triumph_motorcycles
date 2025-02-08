import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma/PrismaService';
import { MaintenanceRepository } from '../../../../../application/ports/repositories/MaintenanceRepository';
import { Maintenance } from '../../../../../domain/entities/Maintenance';
import { Motorcycle } from '../../../../../domain/entities/Motorcycle';
import { Part } from '../../../../../domain/entities/Part';
import { MaintenanceReference } from '../../../../../domain/values/Maintenance/maintenanceReference';

@Injectable()
export class MaintenanceRepositoryImpl implements MaintenanceRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToMaintenance(prismaMaintenance: any): Maintenance {
    return new Maintenance(
      prismaMaintenance.id,
      new MaintenanceReference(prismaMaintenance.reference).getReference(),
      new Date(prismaMaintenance.date),
      prismaMaintenance.technician,
      prismaMaintenance.recommendation,
      Number(prismaMaintenance.pricePartTotal),
      Number(prismaMaintenance.priceLabour),
      new Motorcycle(
        prismaMaintenance.motorcycle.id,
        prismaMaintenance.motorcycle.brand,
        prismaMaintenance.motorcycle.model,
        new Date(prismaMaintenance.motorcycle.purchaseDate),
        prismaMaintenance.motorcycle.licensePlate,
        prismaMaintenance.motorcycle.kilometers,
        new Date(prismaMaintenance.motorcycle.warrantyDate),
        prismaMaintenance.motorcycle.maintenanceInterval,
        prismaMaintenance.motorcycle.ownerId,
        prismaMaintenance.motorcycle.created_by,
        prismaMaintenance.motorcycle.updated_by,
      ),
      new Part(
        prismaMaintenance.part.id,
        prismaMaintenance.part.part_reference,
        prismaMaintenance.part.part_type,
        prismaMaintenance.part.part_name,
        prismaMaintenance.part.quantity_in_stock,
        prismaMaintenance.part.part_threshold,
        prismaMaintenance.part.unit_price,
        prismaMaintenance.part.created_by,
        prismaMaintenance.part.updated_by,
        new Date(prismaMaintenance.part.created_at),
        new Date(prismaMaintenance.part.updated_at)
      )
    );
  }

  async save(maintenance: Maintenance): Promise<Maintenance> {
    const maintenanceDateParsed = maintenance.date instanceof Date ? maintenance.date : new Date(maintenance.date);
    const pricePartTotalParsed = Number(maintenance.pricePartTotal);
    const priceLabourParsed = Number(maintenance.priceLabour);

    const existingMaintenance = await this.prisma.maintenance.findUnique({
      where: { reference: maintenance.reference.getReference() },
    });

    if (existingMaintenance) {
      const updatedMaintenance = await this.prisma.maintenance.update({
        where: { id: maintenance.id },
        data: {
          reference: maintenance.reference.getReference(),
          date: maintenanceDateParsed,
          technician: maintenance.technician,
          recommendation: maintenance.recommendation,
          pricePartTotal: pricePartTotalParsed,
          priceLabour: priceLabourParsed,
          priceTotal: pricePartTotalParsed + priceLabourParsed,
          motorcycleId: maintenance.motorcycle.id,
          partId: maintenance.part.id,
          updatedAt: new Date(),
        },
        include: {
          motorcycle: true,
          part: true,
        },
      });
      return this.mapToMaintenance(updatedMaintenance);
    }

    const newMaintenance = await this.prisma.maintenance.create({
      data: {
        reference: maintenance.reference.getReference(),
        date: maintenanceDateParsed,
        technician: maintenance.technician,
        recommendation: maintenance.recommendation,
        pricePartTotal: pricePartTotalParsed,
        priceLabour: priceLabourParsed,
        priceTotal: pricePartTotalParsed + priceLabourParsed,
        motorcycleId: maintenance.motorcycle.id,
        partId: maintenance.part.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        motorcycle: true,
        part: true,
      },
    });

    return this.mapToMaintenance(newMaintenance);
  }

  async findById(id: string): Promise<Maintenance | null> {
    const prismaMaintenance = await this.prisma.maintenance.findUnique({
      where: { id },
      include: {
        motorcycle: true,
        part: true,
      },
    });

    if (!prismaMaintenance) return null;
    return this.mapToMaintenance(prismaMaintenance);
  }

  async getAll(): Promise<Maintenance[]> {
    const prismaMaintenances = await this.prisma.maintenance.findMany({
      include: {
        motorcycle: true,
        part: true,
      },
    });

    return prismaMaintenances.map(this.mapToMaintenance);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.maintenance.delete({
      where: { id },
    });
  }
}