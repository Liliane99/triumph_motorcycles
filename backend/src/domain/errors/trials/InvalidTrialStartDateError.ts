export class InvalidTrialStartDateError extends Error {
  constructor(value: unknown) {
    const formattedValue = typeof value === "object" ? JSON.stringify(value) : String(value);
    super(`La date de début de l'essai est invalide : ${formattedValue}`);
    this.name = "InvalidTrialStartDateError";
  }
}
