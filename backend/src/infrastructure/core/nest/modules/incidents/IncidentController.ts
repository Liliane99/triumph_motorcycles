import { 
    Controller, Post, Body, Get, Param, Put, Delete, UseGuards, Req, Res, HttpStatus 
  } from "@nestjs/common";
  import { Request, Response } from "express";
  import { CommandBus, QueryBus } from "@nestjs/cqrs";
  import { JwtAuthGuard } from "../../guards/JwtAuthGuard";
  import { IncidentsAccessGuard } from "../../guards/IncidentsAccessGuard"; 
  import { v4 as uuidv4 } from "uuid";
  import { CreateIncidentCommand } from "../../../../../application/commands/definitions/incidents/CreateIncidentCommand";
  import { UpdateIncidentCommand } from "../../../../../application/commands/definitions/incidents/UpdateIncidentCommand";
  import { DeleteIncidentCommand } from "../../../../../application/commands/definitions/incidents/DeleteIncidentCommand";
  import { GetIncidentByIdQuery } from "../../../../../application/queries/definitions/incidents/GetIncidentByIdQuery";
  import { ListIncidentsQuery } from "../../../../../application/queries/definitions/incidents/ListIncidentsQuery";
  import { CreateIncidentDto } from "../../dto/CreateIncidentDto";
  import { UpdateIncidentDto } from "../../dto/UpdateIncidentDto";
  import { IncidentNotFoundError } from "../../../../../domain/errors/incidents/IncidentNotFoundError";
  import { IncidentReferenceAlreadyExistsError } from "../../../../../domain/errors/incidents/IncidentReferenceAlreadyExistsError";
  
  @Controller("incidents")
  export class IncidentController {
    constructor(
      private readonly commandBus: CommandBus,
      private readonly queryBus: QueryBus
    ) {}
  
    @Post()
    @UseGuards(JwtAuthGuard, IncidentsAccessGuard)
    async createIncident(@Req() req: Request, @Res() res: Response, @Body() body: CreateIncidentDto) {
      try {
        console.log("Création d'un incident :", body);
  
        const id = uuidv4();
        const createdBy = req.user?.userId ?? "system";
  
        await this.commandBus.execute(
          new CreateIncidentCommand(
            id, body.reference, body.description, body.motorcycleId, createdBy
          )
        );
  
        return res.status(HttpStatus.CREATED).json({ message: "Incident créé avec succès !" });
  
      } catch (error) {
        console.error("Erreur lors de la création de l'incident :", error);
  
        if (error instanceof IncidentReferenceAlreadyExistsError) {
          return res.status(HttpStatus.CONFLICT).json({ message: error.message });
        }
  
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Erreur interne du serveur." });
      }
    }
  
    @Put(":id")
    @UseGuards(JwtAuthGuard, IncidentsAccessGuard)
    async updateIncident(@Req() req: Request, @Res() res: Response, @Param("id") id: string, @Body() body: UpdateIncidentDto) {
      try {
        console.log("Mise à jour de l'incident :", { id, ...body });
  
        const updatedBy = req.user?.userId ?? "system";
  
        await this.commandBus.execute(
          new UpdateIncidentCommand(id, updatedBy, body.description, body.status)
        );
  
        return res.status(HttpStatus.OK).json({ message: "Incident mis à jour avec succès !" });
  
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'incident :", error);
  
        if (error instanceof IncidentNotFoundError) {
          return res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
        }
  
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Erreur interne du serveur." });
      }
    }
  
    @Delete(":id")
    @UseGuards(JwtAuthGuard, IncidentsAccessGuard)
    async deleteIncident(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
      try {
        console.log("Suppression de l'incident :", id);
  
        await this.commandBus.execute(new DeleteIncidentCommand(id));
        return res.status(HttpStatus.NO_CONTENT).send();
  
      } catch (error) {
        console.error("Erreur lors de la suppression de l'incident :", error);
  
        if (error instanceof IncidentNotFoundError) {
          return res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
        }
  
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Erreur interne du serveur." });
      }
    }
  
    @Get()
    @UseGuards(JwtAuthGuard, IncidentsAccessGuard)
    async listIncidents(@Res() res: Response) {
      try {
        console.log("Récupération de la liste des incidents.");
  
        const incidents = await this.queryBus.execute(new ListIncidentsQuery());
        return res.status(HttpStatus.OK).json(incidents);
  
      } catch (error) {
        console.error("Erreur lors de la récupération des incidents :", error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Erreur interne du serveur." });
      }
    }
  
    @Get(":id")
    @UseGuards(JwtAuthGuard, IncidentsAccessGuard)
    async getIncidentById(@Res() res: Response, @Param("id") id: string) {
      try {
        console.log("Récupération de l'incident :", id);
  
        const incident = await this.queryBus.execute(new GetIncidentByIdQuery(id));
        return res.status(HttpStatus.OK).json(incident);
  
      } catch (error) {
        console.error("Erreur lors de la récupération de l'incident :", error);
  
        if (error instanceof IncidentNotFoundError) {
          return res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
        }
  
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Erreur interne du serveur." });
      }
    }
  }
  