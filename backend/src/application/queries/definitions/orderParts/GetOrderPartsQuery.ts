import { Query } from "@nestjs-architects/typed-cqrs";

export class GetOrderPartsQuery extends Query<void> {
  constructor(public readonly orderId: string) {
    super();
  }
}
