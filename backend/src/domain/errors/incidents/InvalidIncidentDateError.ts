export class InvalidIncidentDateError extends Error {
    constructor(value: unknown) {
      super(`Date d'incident invalide : "${value}". La date doit être une instance valide de Date.`);
      this.name = "InvalidIncidentDateError";
    }
}
  