import { Query } from "@nestjs-architects/typed-cqrs";

export class GetMaintenancePartsQuery extends Query<void> {
  constructor(public readonly maintenanceId: string) {
    super();
  }
}
