import { Module } from "@nestjs/common";
import { UserModule } from "./users/UserModule";
import { PartModule } from "./parts/PartModule";
import { OrderModule } from "./orders/OrderModule";
import { OrderPartModule } from "./orderParts/OrderPartModule";
import { MaintenanceModule } from "./maintenances/MaintenanceModule";
import { TrialModule } from "./trials/TrialModule";
import { IncidentModule } from "./incident/IncidentModule";

@Module({
  imports: [UserModule, PartModule, OrderModule, OrderPartModule, MaintenanceModule, TrialModule, IncidentModule],
  
})
export class AppModule {}
