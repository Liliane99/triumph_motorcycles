export class UserNotFoundError extends Error {
    public override readonly name = "UserNotFoundError";
  
    constructor(id: string) {
      super(`L'utilisateur avec l'ID "${id}" n'existe pas.`);
    }
  }
  