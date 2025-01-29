import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
// import { UserModule } from "./user/UserModule";
// import { MaintenanceModule } from "./maintenance/MaintenanceModule";
// import { IncidentModule } from "./incident/IncidentModule";
// import { PartModule } from "./part/PartModule";
// import { CommandModule } from "./cqrs/CommandModule";
// import { QueryModule } from "./cqrs/QueryModule";

@Module({
  imports: [
    ConfigModule.forRoot(), 
    // UserModule,            
    // MaintenanceModule,     
    // IncidentModule,         
    // PartModule,            
    // CommandModule,          
    // QueryModule             
  ],
})
export class AppModule {}
