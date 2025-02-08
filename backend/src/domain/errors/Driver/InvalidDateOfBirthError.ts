export class InvalidDateOfBirthError extends Error {
    public override readonly name = "InvalidDateOfBirthError";
    constructor() {
      super(`La date de naissance est invalide.`);
    }
}
  