import { Request, Response, NextFunction } from 'express';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

// Fonction middleware pour Express
export function notFoundFilter(req: Request, res: Response, next: NextFunction) {
  res.status(404).json({
    statusCode: 404,
    message: "La route demandée n'existe pas",
  });
}

// Classe NotFoundFilter pour NestJS
@Catch()
export class NotFoundFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response.status(404).json({
      statusCode: 404,
      message: `La route ${request.url} n'existe pas`,
    });
  }
}
