export class InvalidPriceError extends Error {
    constructor(value: number) {
      super(`Prix invalide : ${value}. Le prix doit être supérieur à zéro.`);
      this.name = "InvalidPriceError";
    }
}
  