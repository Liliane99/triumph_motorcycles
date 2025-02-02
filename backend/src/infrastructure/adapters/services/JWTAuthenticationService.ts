import { Injectable } from "@nestjs/common";
import { ITokenService } from "../../../application/ports/services/AuthenticationService";
import * as jwt from "jsonwebtoken";

@Injectable()
export class JWTAuthenticationService implements ITokenService {
  generateToken(userId: string, role: "manager" | "client" | "admin"): string {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET || "default_secret", {
      expiresIn: "1h",
    });
  }

  verifyToken(token: string): { userId: string; role: string } | null {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || "default_secret") as {
        userId: string;
        role: string;
      };
    } catch {
      return null;
    }
  }
}
