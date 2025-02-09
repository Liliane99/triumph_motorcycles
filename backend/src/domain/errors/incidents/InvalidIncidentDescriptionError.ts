export class InvalidIncidentDescriptionError extends Error {
    constructor(value: string) {
      super(`Description d'incident invalide : "${value}". La description doit contenir au moins 5 caractères.`);
      this.name = "InvalidIncidentDescriptionError";
    }
  }
  