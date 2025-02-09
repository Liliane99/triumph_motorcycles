import { Query } from "@nestjs-architects/typed-cqrs";

export class ListIncidentsQuery extends Query<void> {
  constructor() {
    super();
  }
}
