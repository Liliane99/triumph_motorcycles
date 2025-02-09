export class MaintenanceAlreadyExistsError extends Error {
    constructor(reference: string) {
      super(`Une maintenance avec la référence "${reference}" existe déjà.`);
      this.name = "MaintenanceAlreadyExistsError";
    }
}
  