import { Query } from "@nestjs-architects/typed-cqrs";

export class ListUsersQuery extends Query<string[]> {
  constructor(public readonly roleFilter: string[]) {
    super();
  }
}
