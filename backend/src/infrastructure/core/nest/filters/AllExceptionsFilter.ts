import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    this.logger.error("Erreur capturée :", exception);

    if (exception instanceof HttpException) {
      return response.status(exception.getStatus()).json({
        message: exception.getResponse(),
      });
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Erreur interne du serveur.",
    });
  }
}
