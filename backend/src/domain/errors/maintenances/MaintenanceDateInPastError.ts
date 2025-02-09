export class MaintenanceDateInPastError extends Error {
    constructor(message: string = 'Maintenance date cant be in the past') {
      super(message);
      this.name = 'MaintenanceDateInPastError'; 
    }
  }
  