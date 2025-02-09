import { 
    Controller, Post, Body, Get, Param, Put, Delete, Req, Res, HttpStatus, UseGuards  
} from "@nestjs/common";
import { Request, Response } from "express";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { JwtAuthGuard } from "../../guards/JwtAuthGuard";
import { v4 as uuidv4 } from "uuid";

import { CreateIncidentCommand } from "../../../../../application/commands/definitions/Incident/AddIncidentCommand";
import { UpdateIncidentCommand } from "../../../../../application/commands/definitions/Incident/UpdateIncidentCommand";
import { DeleteIncidentCommand } from "../../../../../application/commands/definitions/Incident/DeleteIncidentCommand";
import { GetIncidentQuery } from "../../../../../application/queries/definitions/Incident/GetIncidentQuery";
import { GetAllIncidentsQuery } from "../../../../../application/queries/definitions/Incident/GetIncidentQuery";

@UseGuards(JwtAuthGuard)
@Controller("incidents")
export class IncidentController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) {}

    @Post()
    async createIncident(@Req() req: Request, @Res() res: Response, @Body() body: any) {
        try {
            const id = uuidv4();
            await this.commandBus.execute(
                new CreateIncidentCommand(
                    body.reference, body.description, body.date, body.motorcycleId
                )
            );
            return res.status(HttpStatus.CREATED).json({ message: "Incident créé avec succès !" });
        } catch (error) {
            console.error("Error occurred:", error);
            return res.status(HttpStatus.BAD_REQUEST).json({ message: "Une erreur inconnue est survenue.", error });
        }
    }

    @Put(":id")
async updateIncident(@Req() req: Request, @Res() res: Response, @Param("id") id: string, @Body() body: any) {
    try {
        await this.commandBus.execute(
            new UpdateIncidentCommand(id,body.date, body.description, body.motorcycleId)
        );
        return res.status(HttpStatus.OK).json({ message: "Incident mis à jour avec succès !" });
    } catch (error) {
        console.error("Erreur survenue lors de la mise à jour de l'incident:", error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Une erreur inconnue est survenue.",
            error: error,
        });
    }
}

    @Delete(":id")
    async deleteIncident(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
        try {
            await this.commandBus.execute(new DeleteIncidentCommand(id));
            return res.status(HttpStatus.NO_CONTENT).send();
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: "Une erreur inconnue est survenue." });
        }
    }

    @Get()
    async listIncidents(@Res() res: Response) {
        try {
            const incidents = await this.queryBus.execute(new GetAllIncidentsQuery());
            return res.status(HttpStatus.OK).json(incidents);
        } catch (error) {
            console.error("Error occurred:", error);
            return res.status(HttpStatus.BAD_REQUEST).json({ message: "Une erreur inconnue est survenue." });
        }
    }

    @Get(":id")
    async getIncidentById(@Res() res: Response, @Param("id") id: string) {
        try {
            const incident = await this.queryBus.execute(new GetIncidentQuery(id));
            return res.status(HttpStatus.OK).json(incident);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: "Une erreur inconnue est survenue." });
        }
    }
}
