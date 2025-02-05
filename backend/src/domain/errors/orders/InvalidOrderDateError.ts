export class InvalidOrderDateError extends Error {
    constructor(value: Date) {
      super(`Date de commande invalide : ${value}.`);
      this.name = "InvalidOrderDateError";
    }
}
  