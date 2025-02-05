export class OrderNotFoundError extends Error {
    constructor(orderId: string) {
      super(`La commande avec l'ID "${orderId}" est introuvable.`);
      this.name = "OrderNotFoundError";
    }
}
  