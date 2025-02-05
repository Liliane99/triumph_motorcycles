export class InvalidPartNameError extends Error {
    constructor(value: string) {
      super(`Nom de pièce invalide : "${value}". Le nom doit contenir au moins 3 caractères.`);
      this.name = "InvalidPartNameError";
    }
}
  