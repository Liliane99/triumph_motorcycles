export class InvalidIncidentStatusError extends Error {
    constructor(value: string) {
      super(`Statut d'incident invalide : "${value}". Le statut doit être "opened" ou "resolved".`);
      this.name = "InvalidIncidentStatusError";
    }
}
  