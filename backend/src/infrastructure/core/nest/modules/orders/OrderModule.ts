import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { OrderController } from "./OrderController";
import { PrismaOrderRepository } from "../../adapters/repositories/PrismaOrderRepository";
import { PrismaOrderPartRepository } from "../../adapters/repositories/PrismaOrderPartRepository";
import { MongoEventRepository } from "../../adapters/repositories/MongoEventRepository";
import { PrismaService } from "../../../../database/prisma/PrismaService";
import { IOrderRepository } from "../../../../../application/ports/repositories/OrderRepository";
import { IEventPublisherService } from "../../../../../application/ports/services/EventPublisherService";
import { CreateOrderUseCase } from "../../../../../application/usecases/orders/CreateOrderUseCase";
import { UpdateOrderUseCase } from "../../../../../application/usecases/orders/UpdateOrderUseCase";
import { DeleteOrderUseCase } from "../../../../../application/usecases/orders/DeleteOrderUseCase";
import { GetOrderByIdUseCase } from "../../../../../application/usecases/orders/GetOrderByIdUseCase";
import { ListOrdersUseCase } from "../../../../../application/usecases/orders/ListOrdersUseCase";

import { CreateOrderCommandHandler } from "../../../../../application/commands/handlers/CreateOrderCommandHandler";
import { UpdateOrderCommandHandler } from "../../../../../application/commands/handlers/UpdateOrderCommandHandler";
import { DeleteOrderCommandHandler } from "../../../../../application/commands/handlers/DeleteOrderCommandHandler";

import { GetOrderByIdQueryHandler } from "../../../../../application/queries/handlers/GetOrderByIdQueryHandler";
import { ListOrdersQueryHandler } from "../../../../../application/queries/handlers/ListOrdersQueryHandler";
import { OrdersAccessGuard } from "../../guards/OrdersAccessGuard";

@Module({
  imports: [CqrsModule],
  controllers: [OrderController],
  providers: [
    PrismaService,
    {
      provide: "IOrderRepository",
      useClass: PrismaOrderRepository,
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
      provide: CreateOrderUseCase,
      useFactory: (orderRepository: IOrderRepository, eventStore: IEventPublisherService) =>
        new CreateOrderUseCase(orderRepository, eventStore),
      inject: ["IOrderRepository", "IEventPublisherService"],
    },
    {
      provide: UpdateOrderUseCase,
      useFactory: (orderRepository: IOrderRepository, eventStore: IEventPublisherService) =>
        new UpdateOrderUseCase(orderRepository, eventStore),
      inject: ["IOrderRepository", "IEventPublisherService"],
    },
    {
      provide: DeleteOrderUseCase,
      useFactory: (orderRepository: IOrderRepository, eventStore: IEventPublisherService) =>
        new DeleteOrderUseCase(orderRepository, eventStore),
      inject: ["IOrderRepository", "IEventPublisherService"],
    },
    {
      provide: GetOrderByIdUseCase,
      useFactory: (orderRepository: IOrderRepository) => new GetOrderByIdUseCase(orderRepository),
      inject: ["IOrderRepository"],
    },
    {
      provide: ListOrdersUseCase,
      useFactory: (orderRepository: IOrderRepository) => new ListOrdersUseCase(orderRepository),
      inject: ["IOrderRepository"],
    },

    CreateOrderCommandHandler,
    UpdateOrderCommandHandler,
    DeleteOrderCommandHandler,
    GetOrderByIdQueryHandler,
    ListOrdersQueryHandler,
    OrdersAccessGuard,
  ],
  exports: ["IOrderRepository", "IOrderPartRepository", "IEventPublisherService"],
})
export class OrderModule {}
