import { TrialStartDate } from "../values/trials/TrialStartDate";
import { TrialEndDate } from "../values/trials/TrialEndDate";

export class Trial {
  constructor(
    public readonly userId: string,
    public readonly motorcycleId: string,
    public readonly startDate: TrialStartDate,
    public readonly endDate: TrialEndDate,
    public readonly createdBy: string,
    public readonly updatedBy: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  private static validateFields(
    startDate: Date,
    endDate: Date
  ): {
    startDate: TrialStartDate | Error;
    endDate: TrialEndDate | Error;
  } {
    const validStartDate = TrialStartDate.from(startDate);
    if (validStartDate instanceof Error) return { startDate: validStartDate, endDate: validStartDate };

    const validEndDate = TrialEndDate.from(startDate, endDate);
    if (validEndDate instanceof Error) return { startDate: validStartDate, endDate: validEndDate };

    return { startDate: validStartDate, endDate: validEndDate };
  }

  static create(
    userId: string,
    motorcycleId: string,
    startDate: Date,
    endDate: Date,
    createdBy: string
  ): Trial | Error {
    const { startDate: validStartDate, endDate: validEndDate } = this.validateFields(startDate, endDate);

    if (validStartDate instanceof Error) return validStartDate;
    if (validEndDate instanceof Error) return validEndDate;

    return new Trial(
      userId,
      motorcycleId,
      validStartDate,
      validEndDate,
      createdBy,
      createdBy,
      new Date(),
      new Date()
    );
  }

  update(
    startDate?: Date,
    endDate?: Date,
    updatedBy?: string
  ): Trial | Error {
    const { startDate: validStartDate, endDate: validEndDate } = Trial.validateFields(
      startDate ?? this.startDate.value,
      endDate ?? this.endDate.value
    );

    if (validStartDate instanceof Error) return validStartDate;
    if (validEndDate instanceof Error) return validEndDate;

    return new Trial(
      this.userId,
      this.motorcycleId,
      validStartDate,
      validEndDate,
      this.createdBy,
      updatedBy ?? this.updatedBy,
      this.createdAt,
      new Date()
    );
  }
}
