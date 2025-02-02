export class InvalidPhoneNumberError extends Error {
    public override readonly name = "InvalidPhoneNumberError";
    constructor() {
      super("Le numéro de téléphone est invalide.");
    }
}
  