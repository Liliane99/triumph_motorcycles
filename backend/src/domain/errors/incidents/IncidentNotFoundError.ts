export class IncidentNotFoundError extends Error {
    constructor(incidentId: string) {
      super(`L'incident avec l'ID "${incidentId}" est introuvable.`);
      this.name = "IncidentNotFoundError";
    }
}
  