import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../database/prisma/PrismaService";
import { IPartRepository } from "../../../../../application/ports/repositories/PartRepository";
import { Part } from "../../../../../domain/entities/Part";
import { Part as PrismaPart } from "@prisma/client";
import { PartReference } from "../../../../../domain/values/parts/PartReference";
import { PartType } from "../../../../../domain/values/parts/PartType";
import { PartName } from "../../../../../domain/values/parts/PartName";
import { Quantity } from "../../../../../domain/values/parts/Quantity";
import { Price } from "../../../../../domain/values/parts/Price";

@Injectable()
export class PrismaPartRepository implements IPartRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPart(part: Part): Promise<Part> {
    const createdPart = await this.prisma.part.create({
      data: {
        part_id: part.id,
        part_reference: part.reference.value,
        part_type: part.type.value,
        part_name: part.name.value,
        quantity_in_stock: part.quantityInStock.value,
        part_threshold: part.partThreshold.value,
        unit_price: part.unitPrice.value,
        created_by: part.createdBy,
        updated_by: part.updatedBy,
        created_at: part.createdAt,
        updated_at: part.updatedAt,
      },
    });

    return this.mapToDomain(createdPart);
  }

  async updatePart(part: Part): Promise<Part | null> {
    const updatedPart = await this.prisma.part.update({
      where: { part_id: part.id },
      data: {
        part_name: part.name.value,
        quantity_in_stock: part.quantityInStock.value,
        part_threshold: part.partThreshold.value,
        unit_price: part.unitPrice.value,
        updated_by: part.updatedBy,
        updated_at: new Date(),
      },
    });

    return updatedPart ? this.mapToDomain(updatedPart) : null;
  }

  async getPartById(id: string): Promise<Part | null> {
    const part = await this.prisma.part.findUnique({
      where: { part_id: id },
    });

    return part ? this.mapToDomain(part) : null;
  }

  async getPartByReference(reference: string): Promise<Part | null> {
    const part = await this.prisma.part.findUnique({
      where: { part_reference: reference },
    });

    return part ? this.mapToDomain(part) : null;
  }

  async listParts(): Promise<Part[]> {
    const parts = await this.prisma.part.findMany();
    return parts.map((part) => this.mapToDomain(part));
  }

  async deletePart(id: string): Promise<void> {
    await this.prisma.part.delete({ where: { part_id: id } });
  }

  async getPartTypeById(id: string): Promise<string | null> {
    const part = await this.prisma.part.findUnique({
      where: { part_id: id },
      select: { part_type: true },
    });

    return part ? part.part_type : null;
  }

  private mapToDomain(part: PrismaPart): Part {
    const validReference = PartReference.from(part.part_reference ?? "");
    const validType = PartType.from(part.part_type);
    const validName = PartName.from(part.part_name);
    const validQuantity = Quantity.from(part.quantity_in_stock);
    const validThreshold = Quantity.from(part.part_threshold);
    const validPrice = Price.from(part.unit_price.toNumber());

    if (
        validReference instanceof Error ||
        validType instanceof Error ||
        validName instanceof Error ||
        validQuantity instanceof Error ||
        validThreshold instanceof Error ||
        validPrice instanceof Error
    ) {
        throw new Error("Erreur lors de la conversion des valeurs du modèle Prisma vers Part");
    }

    return new Part(
        part.part_id,
        validReference,
        validType,
        validName,
        validQuantity,
        validThreshold,
        validPrice,
        part.created_by ?? "system",
        part.updated_by ?? "system",
        new Date(part.created_at),
        new Date(part.updated_at)
    );
}

}
