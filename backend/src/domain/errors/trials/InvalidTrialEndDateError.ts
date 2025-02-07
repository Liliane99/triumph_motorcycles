export class InvalidTrialEndDateError extends Error {
  constructor(value: unknown, message: string = "La date de fin est invalide.") {
    const formattedValue = typeof value === "object" ? JSON.stringify(value) : String(value);
    super(`${message} Valeur reçue : ${formattedValue}`);
    this.name = "InvalidTrialEndDateError";
  }
}
