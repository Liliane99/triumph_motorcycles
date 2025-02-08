import { Query } from "@nestjs-architects/typed-cqrs";

export class GetTrialByIdQuery extends Query<void> {
  constructor(public readonly userId: string, public readonly motorcycleId: string) {
    super();
  }
}
