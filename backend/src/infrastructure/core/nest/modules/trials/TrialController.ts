import { 
    Controller, Post, Put, Delete, Get, Param, Body, UseGuards, Req, Res, HttpStatus 
  } from "@nestjs/common";
  import { Request, Response } from "express";
  import { CommandBus, QueryBus } from "@nestjs/cqrs";
  import { JwtAuthGuard } from "../../guards/JwtAuthGuard";
  import { TrialsAccessGuard } from "../../guards/TrialsAccessGuard";
  
  import { CreateTrialCommand } from "../../../../../application/commands/definitions/trials/CreateTrialCommand";
  import { UpdateTrialCommand } from "../../../../../application/commands/definitions/trials/UpdateTrialCommand";
  import { DeleteTrialCommand } from "../../../../../application/commands/definitions/trials/DeleteTrialCommand";
  import { GetTrialByIdQuery } from "../../../../../application/queries/definitions/trials/GetTrialByIdQuery";
  import { ListTrialsQuery } from "../../../../../application/queries/definitions/trials/ListTrialsQuery";
  
  @Controller("trials")
  export class TrialController {
    constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}
  
    @Post()
    @UseGuards(JwtAuthGuard, TrialsAccessGuard)
    async createTrial(@Req() req: Request, @Res() res: Response, @Body() body: any) {
      try {
        const createdBy = req.user?.userId ?? "system";
  
        await this.commandBus.execute(
          new CreateTrialCommand(body.userId, body.motorcycleId, body.startDate, body.endDate, createdBy)
        );
  
        return res.status(HttpStatus.CREATED).json({ message: "Essai créé avec succès !" });
      } catch (error) {
        console.error("Erreur lors de la création de l'essai :", error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Erreur interne du serveur." });
      }
    }
  
    @Put(":userId/:motorcycleId")
    @UseGuards(JwtAuthGuard, TrialsAccessGuard)
    async updateTrial(@Req() req: Request, @Res() res: Response, @Param("userId") userId: string, @Param("motorcycleId") motorcycleId: string, @Body() body: any) {
      try {
        const updatedBy = req.user?.userId ?? "system";
        const startDate = new Date(body.startDate);
        const endDate = new Date(body.endDate);
        await this.commandBus.execute(
            new UpdateTrialCommand(userId, motorcycleId, updatedBy, startDate, endDate)
        );
  
        return res.status(HttpStatus.OK).json({ message: "Essai mis à jour avec succès !" });
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'essai :", error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Erreur interne du serveur." });
      }
    }
  
    @Delete(":userId/:motorcycleId")
    @UseGuards(JwtAuthGuard, TrialsAccessGuard)
    async deleteTrial(@Res() res: Response, @Param("userId") userId: string, @Param("motorcycleId") motorcycleId: string) {
      try {
        await this.commandBus.execute(new DeleteTrialCommand(userId, motorcycleId));
        return res.status(HttpStatus.NO_CONTENT).send();
      } catch (error) {
        console.error("Erreur lors de la suppression de l'essai :", error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Erreur interne du serveur." });
      }
    }
  
    @Get()
    @UseGuards(JwtAuthGuard, TrialsAccessGuard)
    async listTrials(@Res() res: Response) {
      try {
        const trials = await this.queryBus.execute(new ListTrialsQuery());
        return res.status(HttpStatus.OK).json(trials);
      } catch (error) {
        console.error("Erreur lors de la récupération des essais :", error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Erreur interne du serveur." });
      }
    }
  
    @Get(":userId/:motorcycleId")
    @UseGuards(JwtAuthGuard, TrialsAccessGuard)
    async getTrialById(@Res() res: Response, @Param("userId") userId: string, @Param("motorcycleId") motorcycleId: string) {
      try {
        const trial = await this.queryBus.execute(new GetTrialByIdQuery(userId, motorcycleId));
        return res.status(HttpStatus.OK).json(trial);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'essai :", error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Erreur interne du serveur." });
      }
    }
  }
  