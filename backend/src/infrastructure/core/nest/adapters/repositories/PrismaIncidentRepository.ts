import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../database/prisma/PrismaService";
import { IIncidentRepository } from "../../../../../application/ports/repositories/IncidentRepository";
import { Incident } from "../../../../../domain/entities/Incident";
import { Incident as PrismaIncident } from "@prisma/client";
import { IncidentReference } from "../../../../../domain/values/incidents/IncidentReference";
import { IncidentDescription } from "../../../../../domain/values/incidents/IncidentDescription";
import { IncidentStatus } from "../../../../../domain/values/incidents/IncidentStatus";
import { IncidentDate } from "../../../../../domain/values/incidents/IncidentDate";

@Injectable()
export class PrismaIncidentRepository implements IIncidentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createIncident(incident: Incident): Promise<Incident> {
    const createdIncident = await this.prisma.incident.create({
      data: {
        id: incident.id,
        reference: incident.reference.value,
        description: incident.description.value,
        status: incident.status.value,
        date: incident.date.value,
        motorcycleId: incident.motorcycleId,
        created_by: incident.createdBy,
        updated_by: incident.updatedBy,
        created_at: incident.createdAt,
        updated_at: incident.updatedAt,
      },
    });

    return this.mapToDomain(createdIncident);
  }

  async updateIncident(incident: Incident): Promise<Incident | null> {
    const updatedIncident = await this.prisma.incident.update({
      where: { id: incident.id },
      data: {
        description: incident.description.value,
        status: incident.status.value,
        updated_by: incident.updatedBy,
        updated_at: new Date(),
      },
    });

    return updatedIncident ? this.mapToDomain(updatedIncident) : null;
  }

  async getIncidentById(id: string): Promise<Incident | null> {
    const incident = await this.prisma.incident.findUnique({
      where: { id },
    });

    return incident ? this.mapToDomain(incident) : null;
  }

  async getIncidentByReference(reference: string): Promise<Incident | null> {
    const incident = await this.prisma.incident.findUnique({
      where: { reference },
    });

    return incident ? this.mapToDomain(incident) : null;
  }

  async listIncidents(): Promise<Incident[]> {
    const incidents = await this.prisma.incident.findMany();
    return incidents.map((incident) => this.mapToDomain(incident));
  }

  async deleteIncident(id: string): Promise<void> {
    await this.prisma.incident.delete({ where: { id } });
  }

  private mapToDomain(incident: PrismaIncident): Incident {
    const validReference = IncidentReference.from(incident.reference);
    const validDescription = IncidentDescription.from(incident.description);
    const validStatus = IncidentStatus.from(incident.status);
    const validDate = IncidentDate.from(incident.date);

    if (
      validReference instanceof Error ||
      validDescription instanceof Error ||
      validStatus instanceof Error ||
      validDate instanceof Error
    ) {
      throw new Error("Erreur lors de la conversion des valeurs du modèle Prisma vers Incident");
    }

    return new Incident(
      incident.id,
      validReference,
      validDescription,
      validDate,
      validStatus,
      incident.motorcycleId,
      incident.created_by ?? "system",
      incident.updated_by ?? "system",
      new Date(incident.created_at),
      new Date(incident.updated_at)
    );
  }
}
