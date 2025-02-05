export class InvalidQuantityOrderedError extends Error {
    constructor(value: number) {
      super(`Quantité commandée invalide : ${value}. Elle doit être supérieure à 0.`);
      this.name = "InvalidQuantityOrderedError";
    }
}
  