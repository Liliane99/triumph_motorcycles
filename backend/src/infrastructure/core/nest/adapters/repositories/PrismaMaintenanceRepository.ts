import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../database/prisma/PrismaService";
import { IMaintenanceRepository } from "../../../../../application/ports/repositories/MaintenanceRepository";
import { Maintenance } from "../../../../../domain/entities/Maintenance";
import { Maintenance as PrismaMaintenance } from "@prisma/client";
import { MaintenanceReference } from "../../../../../domain/values/maintenances/maintenanceReference";
import { MaintenanceDate } from "../../../../../domain/values/maintenances/MaintenanceDate";
import { Recommendation } from "../../../../../domain/values/maintenances/Recommendation";

@Injectable()
export class PrismaMaintenanceRepository implements IMaintenanceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMaintenance(maintenance: Maintenance): Promise<Maintenance> {
    const createdMaintenance = await this.prisma.maintenance.create({
      data: {
        id: maintenance.id,
        reference: maintenance.reference.value,
        date: maintenance.date.value,
        recommendation: maintenance.recommendation.value,
        motorcycleId: maintenance.motorcycleId,
        created_by: maintenance.createdBy,
        updated_by: maintenance.updatedBy,
        created_at: maintenance.createdAt,
        updated_at: maintenance.updatedAt,
      },
    });

    return this.mapToDomain(createdMaintenance);
  }

  async updateMaintenance(maintenance: Maintenance): Promise<Maintenance | null> {
    const updatedMaintenance = await this.prisma.maintenance.update({
      where: { id: maintenance.id },
      data: {
        date: maintenance.date.value,
        recommendation: maintenance.recommendation.value,
        updated_by: maintenance.updatedBy,
        updated_at: new Date(),
      },
    });

    return updatedMaintenance ? this.mapToDomain(updatedMaintenance) : null;
  }

  async getMaintenanceById(id: string): Promise<Maintenance | null> {
    const maintenance = await this.prisma.maintenance.findUnique({
      where: { id },
    });

    return maintenance ? this.mapToDomain(maintenance) : null;
  }

  async getMaintenanceByReference(reference: string): Promise<Maintenance | null> {
    const maintenance = await this.prisma.maintenance.findUnique({
      where: { reference },
    });

    return maintenance ? this.mapToDomain(maintenance) : null;
  }

  async listMaintenances(): Promise<Maintenance[]> {
    const maintenances = await this.prisma.maintenance.findMany();
    return maintenances.map((maintenance) => this.mapToDomain(maintenance));
  }

  async deleteMaintenance(id: string): Promise<void> {
    await this.prisma.maintenance.delete({ where: { id } });
  }

  private mapToDomain(maintenance: PrismaMaintenance): Maintenance {
    const validReference = MaintenanceReference.from(maintenance.reference);
    const validDate = MaintenanceDate.from(maintenance.date);
    const validRecommendation = Recommendation.from(maintenance.recommendation);

    if (
      validReference instanceof Error ||
      validDate instanceof Error ||
      validRecommendation instanceof Error
    ) {
      throw new Error("Erreur lors de la conversion des valeurs du modèle Prisma vers Maintenance");
    }

    return new Maintenance(
      maintenance.id,
      validReference,
      validDate,
      validRecommendation,
      maintenance.motorcycleId,
      maintenance.created_by ?? "system",
      maintenance.updated_by ?? "system",
      new Date(maintenance.created_at),
      new Date(maintenance.updated_at),
    );
  }
}
