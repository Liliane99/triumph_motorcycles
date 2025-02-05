import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { OrderPartController } from "./OrderPartController";
import { PrismaOrderPartRepository } from "../../adapters/repositories/PrismaOrderPartRepository";
import { PrismaService } from "../../../../database/prisma/PrismaService";
import { IOrderPartRepository } from "../../../../../application/ports/repositories/OrderPartRepository";
import { IOrderRepository } from "../../../../../application/ports/repositories/OrderRepository";
import { IPartRepository } from "../../../../../application/ports/repositories/PartRepository";
import { PrismaOrderRepository } from "../../adapters/repositories/PrismaOrderRepository";
import { PrismaPartRepository } from "../../adapters/repositories/PrismaPartRepository";
import { IEventPublisherService } from "../../../../../application/ports/services/EventPublisherService";
import { MongoEventRepository } from "../../adapters/repositories/MongoEventRepository";
import { OrdersPartsAccessGuard } from "../../guards/OrdersPartsAccessGuard";
import { AddPartToOrderUseCase } from "../../../../../application/usecases/orderParts/AddPartToOrderUseCase";
import { UpdatePartInOrderUseCase } from "../../../../../application/usecases/orderParts/UpdatePartInOrderUseCase";
import { RemovePartFromOrderUseCase } from "../../../../../application/usecases/orderParts/RemovePartFromOrderUseCase";
import { GetOrderPartsUseCase } from "../../../../../application/usecases/orderParts/GetOrderPartsUseCase";
import { AddPartToOrderCommandHandler } from "../../../../../application/commands/handlers/orderParts/AddPartToOrderCommandHandler";
import { UpdatePartInOrderCommandHandler } from "../../../../../application/commands/handlers/orderParts/UpdatePartInOrderCommandHandler";
import { RemovePartFromOrderCommandHandler } from "../../../../../application/commands/handlers/orderParts/RemovePartFromOrderCommandHandler";
import { GetOrderPartsQueryHandler } from "../../../../../application/queries/handlers/orderParts/GetOrderPartsQueryHandler";

@Module({
  imports: [CqrsModule],
  controllers: [OrderPartController],
  providers: [
    PrismaService,
    {
      provide: "IOrderRepository",
      useClass: PrismaOrderRepository,
    },
    {
      provide: "IPartRepository",
      useClass: PrismaPartRepository,
    },
    {
      provide: "IOrderPartRepository",
      useClass: PrismaOrderPartRepository,
    },
    {
      provide: "IEventPublisherService",
      useClass: MongoEventRepository,
    },
    {
      provide: AddPartToOrderUseCase,
      useFactory: (
        orderRepository: IOrderRepository,
        orderPartRepository: IOrderPartRepository,
        partRepository: IPartRepository,
        eventStore: IEventPublisherService
      ) =>
        new AddPartToOrderUseCase(orderRepository, orderPartRepository, partRepository, eventStore),
      inject: ["IOrderRepository", "IOrderPartRepository", "IPartRepository", "IEventPublisherService"],
    },
    {
      provide: UpdatePartInOrderUseCase,
      useFactory: (
        orderRepository: IOrderRepository,
        orderPartRepository: IOrderPartRepository,
        partRepository: IPartRepository,
        eventStore: IEventPublisherService
      ) =>
        new UpdatePartInOrderUseCase(orderRepository, orderPartRepository, partRepository, eventStore),
      inject: ["IOrderRepository", "IOrderPartRepository", "IPartRepository", "IEventPublisherService"],
    },
    {
      provide: RemovePartFromOrderUseCase,
      useFactory: (
        orderRepository: IOrderRepository,
        orderPartRepository: IOrderPartRepository,
        partRepository: IPartRepository,
        eventStore: IEventPublisherService
      ) =>
        new RemovePartFromOrderUseCase(orderRepository, orderPartRepository, partRepository, eventStore),
      inject: ["IOrderRepository", "IOrderPartRepository", "IPartRepository", "IEventPublisherService"],
    },
    {
      provide: GetOrderPartsUseCase,
      useFactory: (orderPartRepository: IOrderPartRepository) => new GetOrderPartsUseCase(orderPartRepository),
      inject: ["IOrderPartRepository"],
    },

    AddPartToOrderCommandHandler,
    UpdatePartInOrderCommandHandler,
    RemovePartFromOrderCommandHandler,
    GetOrderPartsQueryHandler,
    OrdersPartsAccessGuard,
  ],
  exports: ["IOrderPartRepository", "IEventPublisherService"],
})
export class OrderPartModule {}
