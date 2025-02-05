export class IncorrectPasswordError extends Error {
    public override readonly name = "IncorrectPasswordError";
  
    constructor() {
      super("Le mot de passe fourni est incorrect.");
    }
}
  