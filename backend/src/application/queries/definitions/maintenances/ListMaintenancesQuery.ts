import { Query } from "@nestjs-architects/typed-cqrs";

export class ListMaintenancesQuery extends Query<void> {
  constructor() {
    super();
  }
}
