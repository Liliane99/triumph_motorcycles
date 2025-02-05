export class WeakPasswordError extends Error {
    public override readonly name = "WeakPasswordError";
  
    constructor() {
      super("Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.");
    }
}
  