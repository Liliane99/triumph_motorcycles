import { 
    Controller, Post, Body, Get, Param, Put, Delete, UseGuards, Req, Res, HttpStatus 
  } from "@nestjs/common";
  import { Request, Response } from "express";
  import { CommandBus, QueryBus } from "@nestjs/cqrs";
  import { JwtAuthGuard } from "../../guards/JwtAuthGuard";
  import { MaintenancesAccessGuard } from "../../guards/MaintenancesAccessGuard";
  import { v4 as uuidv4 } from "uuid";
  import { CreateMaintenanceCommand } from "../../../../../application/commands/definitions/maintenances/CreateMaintenanceCommand";
  import { UpdateMaintenanceCommand } from "../../../../../application/commands/definitions/maintenances/UpdateMaintenanceCommand";
  import { DeleteMaintenanceCommand } from "../../../../../application/commands/definitions/maintenances/DeleteMaintenanceCommand";
  import { GetMaintenanceByIdQuery } from "../../../../../application/queries/definitions/maintenances/GetMaintenanceByIdQuery";
  import { ListMaintenancesQuery } from "../../../../../application/queries/definitions/maintenances/ListMaintenancesQuery";
  import { CreateMaintenanceDto } from "../../dto/CreateMaintenanceDto";
  import { UpdateMaintenanceDto } from "../../dto/UpdateMaintenanceDto";
  import { MaintenanceNotFoundError } from "../../../../../domain/errors/maintenances/MaintenanceNotFoundError";
  
  @Controller("maintenances")
  export class MaintenanceController {
    constructor(
      private readonly commandBus: CommandBus,
      private readonly queryBus: QueryBus
    ) {}
  
    @Post()
    @UseGuards(JwtAuthGuard, MaintenancesAccessGuard)
    async createMaintenance(@Req() req: Request, @Res() res: Response, @Body() body: CreateMaintenanceDto) {
      try {
        const id = uuidv4();
        const createdBy = req.user?.userId ?? "system";
  
        await this.commandBus.execute(
          new CreateMaintenanceCommand(id, body.reference, body.date, body.recommendation, body.motorcycleId, createdBy)
        );
  
        return res.status(HttpStatus.CREATED).json({ 
          message: "Maintenance créée avec succès !",
          id: id
        });
  
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Erreur interne du serveur." });
      }
    }
  
    @Put(":id")
    @UseGuards(JwtAuthGuard, MaintenancesAccessGuard)
    async updateMaintenance(@Req() req: Request, @Res() res: Response, @Param("id") id: string, @Body() body: UpdateMaintenanceDto) {
      try {
        const updatedBy = req.user?.userId ?? "system";
  
        await this.commandBus.execute(
          new UpdateMaintenanceCommand(id, updatedBy, body.recommendation, body.date)
        );
  
        return res.status(HttpStatus.OK).json({ message: "Maintenance mise à jour avec succès !" });
  
      } catch (error) {
        if (error instanceof MaintenanceNotFoundError) {
          return res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
        }
  
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Erreur interne du serveur." });
      }
    }
  
    @Delete(":id")
    @UseGuards(JwtAuthGuard, MaintenancesAccessGuard)
    async deleteMaintenance(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
      try {
        await this.commandBus.execute(new DeleteMaintenanceCommand(id));
        return res.status(HttpStatus.NO_CONTENT).send();
  
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Erreur interne du serveur." });
      }
    }
  
    @Get()
    @UseGuards(JwtAuthGuard, MaintenancesAccessGuard)
    async listMaintenances(@Res() res: Response) {
      try {
        const maintenances = await this.queryBus.execute(new ListMaintenancesQuery());
        return res.status(HttpStatus.OK).json(maintenances);
      } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Erreur interne du serveur." });
      }
    }
  
    @Get(":id")
    @UseGuards(JwtAuthGuard, MaintenancesAccessGuard)
    async getMaintenanceById(@Res() res: Response, @Param("id") id: string) {
      try {
        const maintenance = await this.queryBus.execute(new GetMaintenanceByIdQuery(id));
        return res.status(HttpStatus.OK).json(maintenance);
      } catch (error) {
        if (error instanceof MaintenanceNotFoundError) {
          return res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
        }
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Erreur interne du serveur." });
      }
    }
  }
  