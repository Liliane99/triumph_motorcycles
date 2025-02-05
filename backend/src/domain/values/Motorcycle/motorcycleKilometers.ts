export class Kilometers {
    private readonly value: number;
  
    constructor(value: number) {
      if (value < 0) {
        throw new Error("Kilometers can't be negative.");
      }
      this.value = value;
    }
  
    get(): number {
      return this.value;
    }
  }