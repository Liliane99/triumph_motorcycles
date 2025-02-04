export class MotorWithSimilarLicensePlateError extends Error {
  constructor(licensePlate: string) {
    super(`Motorcycle with license plate ${licensePlate} already exists.`);
  }
}