import { v4 as uuidv4 } from 'uuid';
import { Motorcycle } from './Motorcycle';
import { IncidentReference } from '../values/Incident/IncidentReference';
import { InvalidDateError } from '../errors/Incident/InvalidDateError';

export class Incident {
    public reference: IncidentReference;
    public description: string;
    public date: Date;
    public motorcycleId: string;
    public motorcycle: Motorcycle;

    constructor(
        public readonly id: string = uuidv4(),
        reference: string,
        description: string,
        date: Date,
        motorcycle: Motorcycle,
    ) {
        
        const incidentDate = date instanceof Date ? date : new Date(date);

        if (isNaN(incidentDate.getTime())) {
        throw new Error("Format de date invalide.");
        }

        if (incidentDate.getTime() < new Date().setHours(0, 0, 0, 0)) {
        throw new Error("La date de l'incident ne peut pas être dans le passé.");
        }

        this.reference = new IncidentReference(reference);
        this.description = description;
        this.date = incidentDate;
        this.motorcycle = motorcycle;
        this.motorcycleId = motorcycle.id;
    }
}
