import { Query } from "@nestjs-architects/typed-cqrs";

export class ListOrdersQuery extends Query<void> {
  constructor() {
    super();
  }
}
