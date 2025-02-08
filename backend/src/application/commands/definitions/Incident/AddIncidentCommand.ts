export class CreateIncidentCommand {
    constructor(
        public readonly reference: string,
        public readonly description: string,
        public readonly date: Date,
        public readonly motorcycleId: string,
    ) {}
}
