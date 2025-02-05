export class InvalidEmailError extends Error {
    public override readonly name = "InvalidEmailError";
  
    constructor() {
      super("L'adresse email fournie est invalide.");
    }
}
  