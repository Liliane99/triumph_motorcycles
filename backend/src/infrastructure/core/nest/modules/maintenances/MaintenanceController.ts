import { 
    Controller, Post, Body, Get, Param, Put, Delete, Req, Res, HttpStatus 
} from "@nestjs/common";
import { Request, Response } from "express";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { v4 as uuidv4 } from "uuid";
import { CreateMaintenanceCommand } from "../../../../../application/commands/definitions/Maintenance/AddMaintenanceCommand";
import { UpdateMaintenanceCommand } from "../../../../../application/commands/definitions/Maintenance/UpdateMaintenanceCommand";
import { DeleteMaintenanceCommand } from "../../../../../application/commands/definitions/Maintenance/DeleteMaintenanceCommand";
import { GetMaintenanceQuery } from "../../../../../application/queries/definitions/Maintenance/GetMaintenanceQuery";
import { GetAllMaintenanceQuery } from "../../../../../application/queries/definitions/Maintenance/GetMaintenanceQuery";

@Controller("maintenances")
export class MaintenanceController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) {}

    @Post()
    async createMaintenance(@Req() req: Request, @Res() res: Response, @Body() body: any) {
        try {
            const id = uuidv4();
            await this.commandBus.execute(
                new CreateMaintenanceCommand(
                    body.reference, body.date, body.technician, body.recommendation, 
                    body.pricePartTotal, body.priceLabour, body.motorcycleId, body.partId
                )
            );
            return res.status(HttpStatus.CREATED).json({ message: "Maintenance créée avec succès !" });
        } catch (error) {
            console.error("Error occurred:", error);
            return res.status(HttpStatus.BAD_REQUEST).json({ message: "Une erreur inconnue est survenue." });
        }
    }

    @Put(":id")
    async updateMaintenance(@Req() req: Request, @Res() res: Response, @Param("id") id: string, @Body() body: any) {
        try {
            await this.commandBus.execute(
                new UpdateMaintenanceCommand(id, body.date, body.technician, 
                    body.recommendation, body.pricePartTotal, body.priceLabour)
            );
            return res.status(HttpStatus.OK).json({ message: "Maintenance mise à jour avec succès !" });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: "Une erreur inconnue est survenue." });
        }
    }

    @Delete(":id")
    async deleteMaintenance(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        try {
            await this.commandBus.execute(new DeleteMaintenanceCommand(id));
            return res.status(HttpStatus.NO_CONTENT).send();
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: "Une erreur inconnue est survenue." });
        }
    }

    @Get()
    async listMaintenances(@Res() res: Response) {
        try {
            const maintenances = await this.queryBus.execute(new GetAllMaintenanceQuery());
            return res.status(HttpStatus.OK).json(maintenances);
        } catch (error) {
            console.error("Error occurred:", error);
            return res.status(HttpStatus.BAD_REQUEST).json({ message: "Une erreur inconnue est survenue." });
        }
    }

    @Get(":id")
    async getMaintenanceById(@Res() res: Response, @Param("id") id: string) {
        try {
            const maintenance = await this.queryBus.execute(new GetMaintenanceQuery(id));
            return res.status(HttpStatus.OK).json(maintenance);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: "Une erreur inconnue est survenue." });
        }
    }
}