export class InvalidMaintenanceDateError extends Error {
    constructor(value: Date) {
      super(`Date de maintenance invalide : ${value}.`);
      this.name = "InvalidMaintenanceDateError";
    }
}
  