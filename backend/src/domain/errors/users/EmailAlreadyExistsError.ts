export class EmailAlreadyExistsError extends Error {
    public override readonly name = "EmailAlreadyExistsError";
  
    constructor(email: string) {
      super(`L'email "${email}" est déjà utilisé.`);
    }
}
  