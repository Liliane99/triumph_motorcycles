import { Query } from "@nestjs-architects/typed-cqrs";

export class ListTrialsQuery extends Query<void> {
  constructor() {
    super();
  }
}
