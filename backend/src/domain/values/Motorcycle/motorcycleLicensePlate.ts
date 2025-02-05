export class LicensePlate {
    private readonly value: string;
  
    constructor(value: string) {
      const regex = /^[A-Z]{2}-\d{3}-[A-Z]{2}/; 
      if (!regex.test(value)) {
        throw new Error("Invalid license plate format.");
      }
      this.value = value;
    }
  
    get(): string {
      return this.value;
    }
  }