export class InvalidRoleError extends Error {
  public override readonly name = "InvalidRoleError";

  constructor() {
    super("Le rôle fourni est invalide. Les rôles valides sont : 'manager', 'client', 'admin'.");
  }
}
