export class TrialNotFoundError extends Error {
    constructor(userId: string, motorcycleId: string) {
      super(`Aucun essai trouvé pour l'utilisateur "${userId}" et la moto "${motorcycleId}".`);
      this.name = "TrialNotFoundError";
    }
  }
  