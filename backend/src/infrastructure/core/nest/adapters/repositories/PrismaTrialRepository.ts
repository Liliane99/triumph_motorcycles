import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../database/prisma/PrismaService";
import { ITrialRepository } from "../../../../../application/ports/repositories/TrialRepository";
import { Trial } from "../../../../../domain/entities/Trial";
import { Trial as PrismaTrial } from "@prisma/client";
import { TrialStartDate } from "../../../../../domain/values/trials/TrialStartDate";
import { TrialEndDate } from "../../../../../domain/values/trials/TrialEndDate";

@Injectable()
export class PrismaTrialRepository implements ITrialRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createTrial(trial: Trial): Promise<Trial> {
    const createdTrial = await this.prisma.trial.create({
      data: {
        userId: trial.userId,
        motorcycleId: trial.motorcycleId,
        startDate: trial.startDate.value,
        endDate: trial.endDate.value,
        created_by: trial.createdBy, 
        updated_by: trial.updatedBy,  
        created_at: trial.createdAt,  
        updated_at: trial.updatedAt,  
      },
    });

    return this.mapToDomain(createdTrial);
  }

  async updateTrial(trial: Trial): Promise<Trial | null> {
    const updatedTrial = await this.prisma.trial.update({
      where: {
        userId_motorcycleId: {
          userId: trial.userId,
          motorcycleId: trial.motorcycleId,
        },
      },
      data: {
        startDate: trial.startDate.value,
        endDate: trial.endDate.value,
        updated_by: trial.updatedBy,  
        updated_at: new Date(),       
      },
    });

    return updatedTrial ? this.mapToDomain(updatedTrial) : null;
  }

  async deleteTrial(userId: string, motorcycleId: string): Promise<void> {
    await this.prisma.trial.delete({
      where: {
        userId_motorcycleId: {
          userId: userId,
          motorcycleId: motorcycleId,
        },
      },
    });
  }

  async getTrialById(userId: string, motorcycleId: string): Promise<Trial | null> {
    const trial = await this.prisma.trial.findUnique({
      where: {
        userId_motorcycleId: {
          userId: userId,
          motorcycleId: motorcycleId,
        },
      },
    });

    return trial ? this.mapToDomain(trial) : null;
  }

  async getTrialsByUserId(userId: string): Promise<Trial[]> {
    const trials = await this.prisma.trial.findMany({
      where: { userId: userId },
    });

    return trials.map((trial) => this.mapToDomain(trial));
  }

  async getTrialsByMotorcycleId(motorcycleId: string): Promise<Trial[]> {
    const trials = await this.prisma.trial.findMany({
      where: { motorcycleId: motorcycleId },
    });

    return trials.map((trial) => this.mapToDomain(trial));
  }

  async listTrials(): Promise<Trial[]> {
    const trials = await this.prisma.trial.findMany();
    return trials.map((trial) => this.mapToDomain(trial));
  }

  private mapToDomain(trial: PrismaTrial): Trial {
    const validStartDate = TrialStartDate.from(trial.startDate);
    const validEndDate = TrialEndDate.from(trial.startDate, trial.endDate);

    if (validStartDate instanceof Error || validEndDate instanceof Error) {
      throw new Error("Erreur lors de la conversion des valeurs du modèle Prisma vers Trial");
    }

    return new Trial(
      trial.userId,
      trial.motorcycleId,
      validStartDate,
      validEndDate,
      trial.created_by ?? "system", 
      trial.updated_by ?? "system",  
      new Date(trial.created_at),  
      new Date(trial.updated_at)     
    );
  }
}
