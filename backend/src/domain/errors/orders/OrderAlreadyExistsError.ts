export class OrderAlreadyExistsError extends Error {
    constructor(reference: string) {
      super(`Une commande avec la référence "${reference}" existe déjà.`);
      this.name = "OrderAlreadyExistsError";
    }
}
  