export class MotorcycleNotFoundError extends Error {
    constructor(motorcycleId: string) {
      super(`Aucune moto trouvée avec l'ID "${motorcycleId}".`);
      this.name = "MotorcycleNotFoundError";
    }
}
  