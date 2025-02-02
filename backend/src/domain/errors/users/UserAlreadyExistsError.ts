export class UserAlreadyExistsError extends Error {
    public override readonly name = "UserAlreadyExistsError";
    constructor(email: string) {
      super(`Un utilisateur avec l'email '${email}' existe déjà.`);
    }
}
  