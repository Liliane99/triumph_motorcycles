export class UnauthorizedUserUpdateError extends Error {
    public override readonly name = "UnauthorizedUserUpdateError";
  
    constructor() {
      super("Vous n'êtes pas autorisé à modifier cet utilisateur.");
    }
}
  