export class InvalidUsernameError extends Error {
    public override readonly name = "InvalidUsernameError";
  
    constructor() {
      super("Le nom d'utilisateur doit contenir entre 3 et 30 caractères.");
    }
}
  