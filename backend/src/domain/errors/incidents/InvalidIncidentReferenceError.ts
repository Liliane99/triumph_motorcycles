export class InvalidIncidentReferenceError extends Error {
    constructor(value: string) {
      super(`Référence d'incident invalide : ${value}.`);
      this.name = "InvalidIncidentReferenceError";
    }
  }
  