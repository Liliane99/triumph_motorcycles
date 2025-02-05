export class InvalidDeliveryDateError extends Error {
    constructor(value: Date | string) {
      super(`Date de livraison invalide : ${value}. La date de livraison ne peut pas être antérieure à la date de commande.`);
      this.name = "InvalidDeliveryDateError";
    }
}
  