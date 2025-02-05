import { 
  Controller, Post, Body, Get, Param, Put, Delete, UseGuards, Req, Res, HttpStatus 
} from "@nestjs/common";
import { Request, Response } from "express";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { JwtAuthGuard } from "../../guards/JwtAuthGuard";
import { OrdersAccessGuard } from "../../guards/OrdersAccessGuard";
import { v4 as uuidv4 } from "uuid";

import { CreateOrderCommand } from "../../../../../application/commands/definitions/CreateOrderCommand";
import { UpdateOrderCommand } from "../../../../../application/commands/definitions/UpdateOrderCommand";
import { DeleteOrderCommand } from "../../../../../application/commands/definitions/DeleteOrderCommand";
import { GetOrderByIdQuery } from "../../../../../application/queries/definitions/GetOrderByIdQuery";
import { ListOrdersQuery } from "../../../../../application/queries/definitions/ListOrdersQuery";

import { CreateOrderDto } from "../../dto/CreateOrderDto";
import { UpdateOrderDto } from "../../dto/UpdateOrderDto";

import { OrderNotFoundError } from "../../../../../domain/errors/orders/OrderNotFoundError";
import { InvalidOrderDateError } from "../../../../../domain/errors/orders/InvalidOrderDateError";
import { InvalidDeliveryDateError } from "../../../../../domain/errors/orders/InvalidDeliveryDateError";
import { OrderAlreadyExistsError } from "../../../../../domain/errors/orders/OrderAlreadyExistsError";

@Controller("orders")
export class OrderController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, OrdersAccessGuard)
  async createOrder(@Req() req: Request, @Res() res: Response, @Body() body: CreateOrderDto) {
    try {
      console.log("🔹 Données reçues :", body);

      const id = uuidv4();
      const createdBy = req.user?.userId ?? "system";

      const orderDate = new Date(body.orderDate);
      const deliveryDate = body.deliveryDate ? new Date(body.deliveryDate) : undefined;

      if (isNaN(orderDate.getTime())) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "La date de commande est invalide." });
      }
      if (deliveryDate && isNaN(deliveryDate.getTime())) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "La date de livraison est invalide." });
      }

      await this.commandBus.execute(
        new CreateOrderCommand(id, body.reference, orderDate, createdBy, deliveryDate)
      );

      return res.status(HttpStatus.CREATED).json({ message: "Commande créée avec succès !" });

    } catch (error) {
      console.error("Erreur lors de la création de la commande :", error);

      if (error instanceof InvalidOrderDateError || error instanceof InvalidDeliveryDateError) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      }
      
      if (error instanceof OrderAlreadyExistsError) {
        return res.status(HttpStatus.CONFLICT).json({ message: error.message });
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Erreur interne du serveur." });
    }
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, OrdersAccessGuard)
  async updateOrder(@Req() req: Request, @Res() res: Response, @Param("id") id: string, @Body() body: UpdateOrderDto) {
    try {
      console.log("Mise à jour de la commande :", { id, ...body });

      const updatedBy = req.user?.userId ?? "system";
      const deliveryDate = body.deliveryDate ? new Date(body.deliveryDate) : undefined;

      if (deliveryDate && isNaN(deliveryDate.getTime())) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "La date de livraison est invalide." });
      }

      await this.commandBus.execute(
        new UpdateOrderCommand(id, updatedBy, deliveryDate)
      );

      return res.status(HttpStatus.OK).json({ message: "Commande mise à jour avec succès !" });

    } catch (error) {
      console.error("Erreur lors de la mise à jour de la commande :", error);

      if (error instanceof OrderNotFoundError) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Erreur interne du serveur." });
    }
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, OrdersAccessGuard)
  async deleteOrder(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
    try {
      console.log("Suppression de la commande :", id);

      await this.commandBus.execute(new DeleteOrderCommand(id));
      return res.status(HttpStatus.NO_CONTENT).send();

    } catch (error) {
      console.error("Erreur lors de la suppression de la commande :", error);

      if (error instanceof OrderNotFoundError) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Erreur interne du serveur." });
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, OrdersAccessGuard)
  async listOrders(@Res() res: Response) {
    try {
      console.log("Récupération de la liste des commandes.");

      const orders = await this.queryBus.execute(new ListOrdersQuery());
      return res.status(HttpStatus.OK).json(orders);

    } catch (error) {
      console.error("Erreur lors de la récupération des commandes :", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Erreur interne du serveur." });
    }
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, OrdersAccessGuard)
  async getOrderById(@Res() res: Response, @Param("id") id: string) {
    try {
      console.log("Récupération de la commande :", id);

      const order = await this.queryBus.execute(new GetOrderByIdQuery(id));
      return res.status(HttpStatus.OK).json(order);

    } catch (error) {
      console.error("Erreur lors de la récupération de la commande :", error);

      if (error instanceof OrderNotFoundError) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Erreur interne du serveur." });
    }
  }
}
