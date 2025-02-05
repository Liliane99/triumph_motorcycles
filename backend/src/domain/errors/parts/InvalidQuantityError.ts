export class InvalidQuantityError extends Error {
    constructor(value: number) {
      super(`Quantité invalide : ${value}. La quantité ne peut pas être négative.`);
      this.name = "InvalidQuantityError";
    }
}
  