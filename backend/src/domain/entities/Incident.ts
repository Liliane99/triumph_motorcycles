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
        description: string,
        date: Date,
        motorcycle: Motorcycle,
    ) {
        
        if (date < new Date()) {
            throw new InvalidDateError("La date de l'incident ne peut pas être dans le passé.");
        }

        this.reference = new IncidentReference();
        this.description = description;
        this.date = date;
        this.motorcycle = motorcycle;
        this.motorcycleId = motorcycle.id;
    }
}
