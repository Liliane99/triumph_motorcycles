export class Model {
    private readonly value: string;
  
    constructor(value: string) {
      if (!value || value.trim().length < 1) {
        throw new Error("Model can't be empty.");
      }
      this.value = value;
    }
  
    get(): string {
      return this.value;
    }
  }