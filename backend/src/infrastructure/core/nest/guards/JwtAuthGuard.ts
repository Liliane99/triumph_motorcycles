import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import * as jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  role: "manager" | "client" | "admin";
}

declare module "express" {
  export interface Request {
    user?: JwtPayload;
  }
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new UnauthorizedException("No token provided");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "jwt_secret_key") as JwtPayload;
      request.user = decoded; 
      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
