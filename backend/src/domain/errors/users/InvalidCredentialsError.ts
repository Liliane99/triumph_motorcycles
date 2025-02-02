export class InvalidCredentialsError extends Error {
    public override readonly name = "InvalidCredentialsError";
  
    constructor() {
      super("Identifiants invalides.");
    }
}
  