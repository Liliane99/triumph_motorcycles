import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { IPasswordService } from "../../../../../application/ports/services/AuthenticationService";

@Injectable()
export class BcryptPasswordService implements IPasswordService {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
