export class IncidentReferenceAlreadyExistsError extends Error {
    constructor(reference: string) {
      super(`Un incident avec la référence "${reference}" existe déjà.`);
      this.name = "IncidentReferenceAlreadyExistsError";
    }
}
  