export class PartAlreadyExistsError extends Error {
    constructor(reference: string) {
      super(`Une pièce avec la référence "${reference}" existe déjà.`);
      this.name = "PartAlreadyExistsError";
    }
}
  