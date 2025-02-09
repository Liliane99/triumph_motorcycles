import { MaintenanceReference } from "../values/maintenances/maintenanceReference";
import { MaintenanceDate } from "../values/maintenances/MaintenanceDate";
import { Recommendation } from "../values/maintenances/Recommendation";

export class Maintenance {
  constructor(
    public readonly id: string,
    public readonly reference: MaintenanceReference,
    public readonly date: MaintenanceDate,
    public readonly recommendation: Recommendation,
    public readonly motorcycleId: string,
    public readonly createdBy: string,
    public readonly updatedBy: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  private static validateFields(
    reference: string,
    date: Date,
    recommendation: string
  ): {
    reference: MaintenanceReference | Error;
    date: MaintenanceDate | Error;
    recommendation: Recommendation | Error;
  } {
    return {
      reference: MaintenanceReference.from(reference),
      date: MaintenanceDate.from(date),
      recommendation: Recommendation.from(recommendation),
    };
  }

  static create(
    id: string,
    reference: string,
    date: Date,
    recommendation: string,
    motorcycleId: string,
    createdBy: string
  ): Maintenance | Error {
    const { reference: validReference, date: validDate, recommendation: validRecommendation } =
      this.validateFields(reference, date, recommendation);

    if (validReference instanceof Error) return validReference;
    if (validDate instanceof Error) return validDate;
    if (validRecommendation instanceof Error) return validRecommendation;

    return new Maintenance(
      id,
      validReference,
      validDate,
      validRecommendation,
      motorcycleId,
      createdBy,
      createdBy,
      new Date(),
      new Date()
    );
  }

  update(
    date?: Date,
    recommendation?: string,
    updatedBy?: string
  ): Maintenance | Error {
    const validDate = date ? MaintenanceDate.from(date) : this.date;
    const validRecommendation = recommendation
      ? Recommendation.from(recommendation)
      : this.recommendation;

    if (validDate instanceof Error) return validDate;
    if (validRecommendation instanceof Error) return validRecommendation;

    return new Maintenance(
      this.id,
      this.reference,
      validDate,
      validRecommendation,
      this.motorcycleId,
      this.createdBy,
      updatedBy ?? this.updatedBy,
      this.createdAt,
      new Date()
    );
  }
}
