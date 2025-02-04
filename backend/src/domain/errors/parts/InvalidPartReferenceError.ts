export class InvalidPartReferenceError extends Error {
    constructor(value: string) {
      super(`Référence de pièce invalide : ${value}.`);
      this.name = "InvalidPartReferenceError";
    }
}
  