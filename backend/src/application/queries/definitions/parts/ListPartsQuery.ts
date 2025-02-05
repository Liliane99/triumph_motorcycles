import { Query } from "@nestjs-architects/typed-cqrs";

export class ListPartsQuery extends Query<void> {
  constructor() {
    super();
  }
}
