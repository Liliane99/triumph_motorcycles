export interface IPasswordService {
    hashPassword(password: string): Promise<string>;
    comparePasswords(password: string, hash: string): Promise<boolean>;
}

export interface ITokenService {
generateToken(userId: string, role: "manager" | "client" | "admin"): string;
verifyToken(token: string): { userId: string; role: string } | null;
}
  