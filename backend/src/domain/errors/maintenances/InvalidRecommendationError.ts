export class InvalidRecommendationError extends Error {
    constructor(value: string) {
      super(`Recommandation invalide : ${value}.`);
      this.name = "InvalidRecommendationError";
    }
}
  