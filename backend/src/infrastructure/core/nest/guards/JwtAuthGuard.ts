import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import * as jwt from "jsonwebtoken";

// ✅ Définition stricte du format du token JWT
interface JwtPayload {
  userId: string;
  role: "manager" | "client" | "admin";
}

// ✅ Extension de `Request` pour inclure notre utilisateur authentifié
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
      // ✅ Vérification et typage sécurisé du token JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "jwt_secret_key") as JwtPayload;
      request.user = decoded; // ✅ Plus besoin de `as any`, `user` est reconnu comme une propriété de `Request`
      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
