import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma/PrismaService';
import { IncidentRepository } from '../../../../../application/ports/repositories/IncidentRepository';
import { Incident } from '../../../../../domain/entities/Incident';
import { Motorcycle } from '../../../../../domain/entities/Motorcycle';


@Injectable()
export class IncidentRepositoryImpl implements IncidentRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToIncident(prismaIncident: any): Incident {
    return new Incident(
      prismaIncident.id,
      prismaIncident.reference,
      prismaIncident.description,
      new Date(prismaIncident.date),
      new Motorcycle(
        prismaIncident.motorcycle.id,
        prismaIncident.motorcycle.brand,
        prismaIncident.motorcycle.model,
        new Date(prismaIncident.motorcycle.purchaseDate),
        prismaIncident.motorcycle.licensePlate,
        prismaIncident.motorcycle.kilometers,
        new Date(prismaIncident.motorcycle.warrantyDate),
        prismaIncident.motorcycle.maintenanceInterval,
        prismaIncident.motorcycle.ownerId,
        prismaIncident.motorcycle.createdBy,
        prismaIncident.motorcycle.updatedBy
      ),
    );
  }

  async save(incident: Incident): Promise<Incident> {
    const incidentDateParsed = incident.date instanceof Date ? incident.date : new Date(incident.date);

    
    const existingIncident = await this.prisma.incident.findUnique({
      where: { reference: incident.reference.getReference() },
    });

    if (existingIncident) {
      const updatedIncident = await this.prisma.incident.update({
        where: { id: incident.id },
        data: {
          reference: incident.reference.getReference(),
          description: incident.description,
          date: incidentDateParsed,
          motorcycleId: incident.motorcycle.id,
          updated_at: new Date(),
        },
        include: {
          motorcycle: true,
        },
      });

      return this.mapToIncident(updatedIncident);
    }

   
    const newIncident = await this.prisma.incident.create({
      data: {
        reference: incident.reference.getReference(),
        description: incident.description,
        date: incidentDateParsed,
        motorcycleId: incident.motorcycle.id,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        motorcycle: true,
      },
    });

    return this.mapToIncident(newIncident);
  }

  async findById(id: string): Promise<Incident | null> {
    const prismaIncident = await this.prisma.incident.findUnique({
      where: { id },
      include: {
        motorcycle: true,
      },
    });

    if (!prismaIncident) return null;
    return this.mapToIncident(prismaIncident);
  }

  async getAll(): Promise<Incident[]> {
    const prismaIncidents = await this.prisma.incident.findMany({
      include: {
        motorcycle: true,
      },
    });

    return prismaIncidents.map(this.mapToIncident);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.incident.delete({
      where: { id },
    });
  }
}
