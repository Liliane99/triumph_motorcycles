export class OrderPartRelationError extends Error {
    constructor() {
      super(`Erreur lors de la relation entre la commande et les pièces.`);
      this.name = "OrderPartRelationError";
    }
}
  