import { Module } from "@nestjs/common";
import { UserModule } from "./users/UserModule";
import { PartModule } from "./parts/PartModule";
import { OrderModule } from "./orders/OrderModule";
import { OrderPartModule } from "./orderParts/OrderPartModule";

@Module({
  imports: [UserModule, PartModule, OrderModule, OrderPartModule],
})
export class AppModule {}
