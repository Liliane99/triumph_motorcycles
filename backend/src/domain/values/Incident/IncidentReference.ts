import { InvalidReferenceError } from "../../errors/Incident/InvalidReferenceError";

export class IncidentReference {
    private readonly value: string;
    private static readonly REFERENCE_REGEX = /^INC-\d{3}$/;

    constructor() {
        this.value = `INC-${Math.floor(100 + Math.random() * 900)}`;

        
        if (!IncidentReference.REFERENCE_REGEX.test(this.value)) {
            throw new InvalidReferenceError(`Référence invalide : ${this.value}`);
        }
    }

    toString(): string {
        return this.value;
    }
}
