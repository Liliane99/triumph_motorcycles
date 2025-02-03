import { 
    Controller, Post, Body, Get, Param, Put, Delete, UseGuards, Req, Res, HttpStatus 
  } from "@nestjs/common";
  import { Request, Response } from "express";
  import { CommandBus, QueryBus } from "@nestjs/cqrs";
  import { JwtAuthGuard } from "../../guards/JwtAuthGuard";
  import { PartsAccessGuard } from "../../guards/PartsAccessGuard"; 
  import { v4 as uuidv4 } from "uuid";
  import { CreatePartCommand } from "../../../../../application/commands/definitions/CreatePartCommand";
  import { UpdatePartCommand } from "../../../../../application/commands/definitions/UpdatePartCommand";
  //import { DeletePartCommand } from "../../../../../application/commands/definitions/DeletePartCommand";
  import { GetPartByIdQuery } from "../../../../../application/queries/definitions/GetPartByIdQuery";
  import { ListPartsQuery } from "../../../../../application/queries/definitions/ListPartsQuery";
  import { CreatePartDto } from "../../dto/CreatePartDto";
  import { UpdatePartDto } from "../../dto/UpdatePartDto";
  import { PartNotFoundError } from "../../../../../domain/errors/parts/PartNotFoundError";
  import { PartAlreadyExistsError } from "../../../../../domain/errors/parts/PartAlreadyExistsError";
  
  @Controller("parts")
  export class PartController {
    constructor(
      private readonly commandBus: CommandBus,
      private readonly queryBus: QueryBus
    ) {}
  
    @Post()
    @UseGuards(JwtAuthGuard, PartsAccessGuard)
    async createPart(@Req() req: Request, @Res() res: Response, @Body() body: CreatePartDto) {
      try {
        const id = uuidv4();
        const createdBy = req.user?.userId ?? "system";
  
        await this.commandBus.execute(
          new CreatePartCommand(
            id, body.reference, body.type, body.name, body.quantityInStock, body.partThreshold, body.unitPrice, createdBy
          )
        );
  
        return res.status(HttpStatus.CREATED).json({ message: "Pièce créée avec succès !" });
      } catch (error) {
        if (error instanceof PartAlreadyExistsError) {
          return res.status(HttpStatus.CONFLICT).json({ message: error.message });
        }
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "Une erreur inconnue est survenue." });
      }
    }
  
    @Put(":id")
    @UseGuards(JwtAuthGuard, PartsAccessGuard)
    async updatePart(@Req() req: Request, @Res() res: Response, @Param("id") id: string, @Body() body: UpdatePartDto) {
      try {
        const updatedBy = req.user?.userId ?? "system";
  
        await this.commandBus.execute(
          new UpdatePartCommand(id, updatedBy, body.name, body.quantityInStock, body.partThreshold, body.unitPrice)
        );
  
        return res.status(HttpStatus.OK).json({ message: "Pièce mise à jour avec succès !" });
      } catch (error) {
        if (error instanceof PartNotFoundError) {
          return res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
        }
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "Une erreur inconnue est survenue." });
      }
    }
  
    /**
     * ✅ Suppression d'une pièce (Protégé)
     */
    // @Delete(":id")
    // @UseGuards(JwtAuthGuard, PartsAccessGuard)
    // async deletePart(@Req() req: Request, @Res() res: Response, @Param("id") id: string) {
    //   try {
    //     await this.commandBus.execute(new DeletePartCommand(id));
    //     return res.status(HttpStatus.NO_CONTENT).send();
    //   } catch (error) {
    //     if (error instanceof PartNotFoundError) {
    //       return res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
    //     }
    //     return res.status(HttpStatus.BAD_REQUEST).json({ message: "Une erreur inconnue est survenue." });
    //   }
    // }
  
    @Get()
    @UseGuards(JwtAuthGuard, PartsAccessGuard)
    async listParts(@Res() res: Response) {
      try {
        const parts = await this.queryBus.execute(new ListPartsQuery());
        return res.status(HttpStatus.OK).json(parts);
      } catch (error) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "Une erreur inconnue est survenue." });
      }
    }
  
    @Get(":id")
    @UseGuards(JwtAuthGuard, PartsAccessGuard)
    async getPartById(@Res() res: Response, @Param("id") id: string) {
      try {
        const part = await this.queryBus.execute(new GetPartByIdQuery(id));
        return res.status(HttpStatus.OK).json(part);
      } catch (error) {
        if (error instanceof PartNotFoundError) {
          return res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
        }
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "Une erreur inconnue est survenue." });
      }
    }
  }
  