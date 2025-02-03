import { Module } from "@nestjs/common";
import { UserModule } from "./users/UserModule";
import { PartModule } from "./parts/PartModule";

@Module({
  imports: [UserModule, PartModule],
})
export class AppModule {}
