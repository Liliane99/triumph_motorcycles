export class UpdateMotorcycleDto {
    brand: string;
    model: string;
    year: number;
    licensePlate: string;
    kilometers: number;
  
    constructor(brand: string, model: string, year: number, licensePlate: string, kilometers: number) {
      this.brand = brand;
      this.model = model;
      this.year = year;
      this.licensePlate = licensePlate;
      this.kilometers = kilometers;
    }
  }
  