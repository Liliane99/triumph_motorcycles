export class InvalidPartTypeError extends Error {
    constructor(value: string) {
      super(`Type de pièce invalide : ${value}.`);
      this.name = "InvalidPartTypeError";
    }
}
  