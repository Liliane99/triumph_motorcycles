import { Controller, Post, Put, Delete, Get, Param, Body, UseGuards, Req, Res, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { JwtAuthGuard } from "../../guards/JwtAuthGuard";
import { OrdersPartsAccessGuard } from "../../guards/OrdersPartsAccessGuard";
import { AddPartToOrderCommand } from "../../../../../application/commands/definitions/AddPartToOrderCommand";
import { UpdatePartInOrderCommand } from "../../../../../application/commands/definitions/UpdatePartInOrderCommand";
import { RemovePartFromOrderCommand } from "../../../../../application/commands/definitions/RemovePartFromOrderCommand";
import { GetOrderPartsQuery } from "../../../../../application/queries/definitions/GetOrderPartsQuery";

@Controller("order-parts")
export class OrderPartController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @Post()
  @UseGuards(JwtAuthGuard, OrdersPartsAccessGuard)
  async addPartToOrder(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    try {
      await this.commandBus.execute(new AddPartToOrderCommand(body.orderId, body.partId, body.quantityOrdered));

      return res.status(HttpStatus.CREATED).json({ message: "Pièce ajoutée à la commande avec succès !" });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Une erreur inconnue est survenue." });
    }
  }

  @Put(":orderId/:partId")
  @UseGuards(JwtAuthGuard, OrdersPartsAccessGuard)
  async updatePartInOrder(@Req() req: Request, @Res() res: Response, @Param("orderId") orderId: string, @Param("partId") partId: string, @Body() body: any) {
    try {
      await this.commandBus.execute(new UpdatePartInOrderCommand(orderId, partId, body.quantityOrdered));

      return res.status(HttpStatus.OK).json({ message: "Quantité mise à jour avec succès !" });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Une erreur inconnue est survenue." });
    }
  }

  @Delete(":orderId/:partId")
  @UseGuards(JwtAuthGuard, OrdersPartsAccessGuard)
  async removePartFromOrder(@Res() res: Response, @Param("orderId") orderId: string, @Param("partId") partId: string) {
    try {
      await this.commandBus.execute(new RemovePartFromOrderCommand(orderId, partId));
      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Une erreur inconnue est survenue." });
    }
  }

  @Get(":orderId")
  @UseGuards(JwtAuthGuard, OrdersPartsAccessGuard)
  async getOrderParts(@Res() res: Response, @Param("orderId") orderId: string) {
    try {
      const orderParts = await this.queryBus.execute(new GetOrderPartsQuery(orderId));
      return res.status(HttpStatus.OK).json(orderParts);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Une erreur inconnue est survenue." });
    }
  }
}
