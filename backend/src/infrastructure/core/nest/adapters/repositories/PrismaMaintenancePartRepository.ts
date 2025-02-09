import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../database/prisma/PrismaService";
import { IMaintenancePartRepository } from "../../../../../application/ports/repositories/MaintenancePartRepository";
import { MaintenancePart } from "../../../../../domain/entities/MaintenancePart";
import { MaintenancePart as PrismaMaintenancePart } from "@prisma/client";
import { QuantityUsed } from "../../../../../domain/values/maintenances/QuantityUsed";

@Injectable()
export class PrismaMaintenancePartRepository implements IMaintenancePartRepository {
  constructor(private readonly prisma: PrismaService) {}

  async addPartToMaintenance(maintenancePart: MaintenancePart): Promise<MaintenancePart> {
    const createdMaintenancePart = await this.prisma.maintenancePart.create({
      data: {
        maintenanceId: maintenancePart.maintenanceId,
        partId: maintenancePart.partId,
        quantity_used: maintenancePart.quantityUsed.value,
      },
    });

    return this.mapToDomain(createdMaintenancePart);
  }

  async updatePartInMaintenance(
    maintenanceId: string,
    partId: string,
    quantityUsed: number
  ): Promise<MaintenancePart | null> {
    const updatedMaintenancePart = await this.prisma.maintenancePart.update({
      where: {
        maintenanceId_partId: {
          maintenanceId,
          partId,
        },
      },
      data: {
        quantity_used: quantityUsed,
      },
    });

    return updatedMaintenancePart ? this.mapToDomain(updatedMaintenancePart) : null;
  }

  async removePartFromMaintenance(maintenanceId: string, partId: string): Promise<void> {
    await this.prisma.maintenancePart.delete({
      where: {
        maintenanceId_partId: {
          maintenanceId,
          partId,
        },
      },
    });
  }

  async getMaintenancePart(maintenanceId: string, partId: string): Promise<MaintenancePart | null> {
    const maintenancePart = await this.prisma.maintenancePart.findUnique({
      where: {
        maintenanceId_partId: {
          maintenanceId,
          partId,
        },
      },
    });

    return maintenancePart ? this.mapToDomain(maintenancePart) : null;
  }

  async getPartsByMaintenanceId(maintenanceId: string): Promise<MaintenancePart[]> {
    const maintenanceParts = await this.prisma.maintenancePart.findMany({
      where: { maintenanceId },
    });

    return maintenanceParts.map((maintenancePart) => this.mapToDomain(maintenancePart));
  }

  private mapToDomain(maintenancePart: PrismaMaintenancePart): MaintenancePart {
    const validQuantityUsed = QuantityUsed.from(maintenancePart.quantity_used);

    if (validQuantityUsed instanceof Error) {
      throw new Error("Erreur lors de la conversion des valeurs du modèle Prisma vers MaintenancePart");
    }

    return new MaintenancePart(
      maintenancePart.maintenanceId,
      maintenancePart.partId,
      validQuantityUsed
    );
  }
}
