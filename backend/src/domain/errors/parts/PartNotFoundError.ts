export class PartNotFoundError extends Error {
    constructor(partId: string) {
      super(`La pièce avec l'ID "${partId}" est introuvable.`);
      this.name = "PartNotFoundError";
    }
}
  