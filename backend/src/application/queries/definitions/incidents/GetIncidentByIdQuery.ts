import { Query } from "@nestjs-architects/typed-cqrs";

export class GetIncidentByIdQuery extends Query<void> {
  constructor(public readonly id: string) {
    super();
  }
}
