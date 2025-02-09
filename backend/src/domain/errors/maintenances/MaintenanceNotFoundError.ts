export class MaintenanceNotFoundError extends Error {
    constructor(maintenanceId: string) {
      super(`La maintenance avec l'ID "${maintenanceId}" est introuvable.`);
      this.name = "MaintenanceNotFoundError";
    }
}
  