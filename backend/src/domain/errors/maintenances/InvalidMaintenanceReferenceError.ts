export class InvalidMaintenanceReferenceError extends Error {
    constructor(value: string) {
      super(`Référence de maintenance invalide : ${value}.`);
      this.name = "InvalidMaintenanceReferenceError";
    }
}
  