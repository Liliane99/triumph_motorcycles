export class UpdateIncidentCommand {
    constructor(
        public readonly id: string,
        public readonly date: Date,
        public readonly description: string,
        public readonly motorcycleId: string
    ) {}
}
