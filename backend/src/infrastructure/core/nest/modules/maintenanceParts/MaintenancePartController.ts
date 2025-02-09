import { Controller, Post, Put, Delete, Get, Param, Body, UseGuards, Req, Res, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { JwtAuthGuard } from "../../guards/JwtAuthGuard";
import { MaintenancesPartsAccessGuard } from "../../guards/MaintenancesPartsAccessGuard";
import { AddPartToMaintenanceCommand } from "../../../../../application/commands/definitions/maintenanceParts/AddPartToMaintenanceCommand";
import { UpdatePartInMaintenanceCommand } from "../../../../../application/commands/definitions/maintenanceParts/UpdatePartInMaintenanceCommand";
import { RemovePartFromMaintenanceCommand } from "../../../../../application/commands/definitions/maintenanceParts/RemovePartFromMaintenanceCommand";
import { GetMaintenancePartsQuery } from "../../../../../application/queries/definitions/maintenanceParts/GetMaintenancePartsQuery";

@Controller("maintenance-parts")
export class MaintenancePartController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @Post()
  @UseGuards(JwtAuthGuard, MaintenancesPartsAccessGuard)
  async addPartToMaintenance(@Req() req: Request, @Res() res: Response, @Body() body: any) {
    try {
      await this.commandBus.execute(new AddPartToMaintenanceCommand(body.maintenanceId, body.partId, body.quantityUsed));

      return res.status(HttpStatus.CREATED).json({ message: "Pièce ajoutée à la maintenance avec succès !" });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Une erreur inconnue est survenue." });
    }
  }

  @Put(":maintenanceId/:partId")
  @UseGuards(JwtAuthGuard, MaintenancesPartsAccessGuard)
  async updatePartInMaintenance(@Req() req: Request, @Res() res: Response, @Param("maintenanceId") maintenanceId: string, @Param("partId") partId: string, @Body() body: any) {
    try {
      await this.commandBus.execute(new UpdatePartInMaintenanceCommand(maintenanceId, partId, body.quantityUsed));

      return res.status(HttpStatus.OK).json({ message: "Quantité mise à jour avec succès !" });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Une erreur inconnue est survenue." });
    }
  }

  @Delete(":maintenanceId/:partId")
  @UseGuards(JwtAuthGuard, MaintenancesPartsAccessGuard)
  async removePartFromMaintenance(@Res() res: Response, @Param("maintenanceId") maintenanceId: string, @Param("partId") partId: string) {
    try {
      await this.commandBus.execute(new RemovePartFromMaintenanceCommand(maintenanceId, partId));
      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Une erreur inconnue est survenue." });
    }
  }

  @Get(":maintenanceId")
  @UseGuards(JwtAuthGuard, MaintenancesPartsAccessGuard)
  async getMaintenanceParts(@Res() res: Response, @Param("maintenanceId") maintenanceId: string) {
    try {
      const maintenanceParts = await this.queryBus.execute(new GetMaintenancePartsQuery(maintenanceId));
      return res.status(HttpStatus.OK).json(maintenanceParts);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Une erreur inconnue est survenue." });
    }
  }
}
