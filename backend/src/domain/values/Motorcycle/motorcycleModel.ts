export class Model {
  private value: string;

  constructor(value: any) {
    if (typeof value !== "string" || !value.trim()) {
      throw new Error("Le modèle de la moto doit être une chaîne de caractères non vide.");
    }
    this.value = value;
  }

  get(): string {
    return this.value;
  }
}
