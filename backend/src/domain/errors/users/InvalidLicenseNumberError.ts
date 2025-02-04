export class InvalidLicenseNumberError extends Error {
    public override readonly name = "InvalidLicenseNumberError";
    constructor() {
      super("Le numéro de permis est invalide.");
    }
}
  