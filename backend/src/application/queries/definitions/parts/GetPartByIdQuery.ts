import { Query } from "@nestjs-architects/typed-cqrs";

export class GetPartByIdQuery extends Query<void> {
  constructor(public readonly id: string) {
    super();
  }
}
