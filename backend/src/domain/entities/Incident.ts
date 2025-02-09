import { IncidentReference } from "../values/incidents/IncidentReference";
import { IncidentDescription } from "../values/incidents/IncidentDescription";
import { IncidentStatus } from "../values/incidents/IncidentStatus";
import { IncidentDate } from "../values/incidents/IncidentDate";

export class Incident {
  constructor(
    public readonly id: string,
    public readonly reference: IncidentReference,
    public readonly description: IncidentDescription,
    public readonly date: IncidentDate,
    public readonly status: IncidentStatus,
    public readonly motorcycleId: string,
    public readonly createdBy: string,
    public readonly updatedBy: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  private static validateFields(
    reference: string,
    description: string,
    status: string,
    date: Date
  ): {
    reference: IncidentReference | Error;
    description: IncidentDescription | Error;
    status: IncidentStatus | Error;
    date: IncidentDate | Error;
  } {
    return {
      reference: IncidentReference.from(reference),
      description: IncidentDescription.from(description),
      status: IncidentStatus.from(status),
      date: IncidentDate.from(date)
    };
  }

  static create(
    id: string,
    reference: string,
    description: string,
    motorcycleId: string,
    createdBy: string
  ): Incident | Error {
    const { reference: validReference, description: validDescription, status: validStatus, date: validDate } = 
      this.validateFields(reference, description, "opened", new Date());

    if (validReference instanceof Error) return validReference;
    if (validDescription instanceof Error) return validDescription;
    if (validStatus instanceof Error) return validStatus;
    if (validDate instanceof Error) return validDate;

    return new Incident(
      id,
      validReference,
      validDescription,
      validDate,
      validStatus,
      motorcycleId,
      createdBy,
      createdBy,
      new Date(),
      new Date()
    );
  }

  update(
    description?: string,
    status?: string,
    updatedBy?: string
  ): Incident | Error {
    const { description: validDescription, status: validStatus } = 
      Incident.validateFields(
        this.reference.value,
        description ?? this.description.value,
        status ?? this.status.value,
        this.date.value
      );

    if (validDescription instanceof Error) return validDescription;
    if (validStatus instanceof Error) return validStatus;

    return new Incident(
      this.id,
      this.reference,
      validDescription,
      this.date,
      validStatus,
      this.motorcycleId,
      this.createdBy,
      updatedBy ?? this.updatedBy,
      this.createdAt,
      new Date()
    );
  }
}
