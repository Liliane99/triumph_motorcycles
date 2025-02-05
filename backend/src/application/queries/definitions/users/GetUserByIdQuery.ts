import { Query } from "@nestjs-architects/typed-cqrs";

export class GetUserByIdQuery extends Query<void> {
  constructor(public readonly id: string) {
    super();
  }
}
