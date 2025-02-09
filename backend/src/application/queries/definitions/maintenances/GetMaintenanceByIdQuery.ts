import { Query } from "@nestjs-architects/typed-cqrs";

export class GetMaintenanceByIdQuery extends Query<void> {
  constructor(public readonly id: string) {
    super();
  }
}
