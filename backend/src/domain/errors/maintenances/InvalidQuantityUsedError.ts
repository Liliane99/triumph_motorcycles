export class InvalidQuantityUsedError extends Error {
    constructor(value: number) {
      super(`Quantité utilisée invalide : ${value}. Elle doit être supérieure à 0.`);
      this.name = "InvalidQuantityUsedError";
    }
}
  