export class MaintenancePartRelationError extends Error {
    constructor() {
      super(`Erreur lors de la relation entre la maintenance et les pièces.`);
      this.name = "MaintenancePartRelationError";
    }
}
  