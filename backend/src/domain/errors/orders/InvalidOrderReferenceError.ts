export class InvalidOrderReferenceError extends Error {
    constructor(value: string) {
      super(`Référence de commande invalide : ${value}.`);
      this.name = "InvalidOrderReferenceError";
    }
  }
  