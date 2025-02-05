export class RentalDateInPastError extends Error {
    constructor() {
      super("Rental date can't be in the past");
      this.name = "RentalDateInPastError";
    }
  }
  