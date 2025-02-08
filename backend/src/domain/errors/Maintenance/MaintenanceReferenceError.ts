export class MaintenanceReferenceAlreadyExistsError extends Error {
    constructor(reference: string) {
      super(`Maintenance reference '${reference}' already exists`);
    }
  }
  