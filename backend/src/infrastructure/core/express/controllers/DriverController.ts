import express, { Request, Response, NextFunction } from 'express';
import { CommandBus } from '../cqrs/CommandBus';
import { QueryBus } from '../cqrs/QueryBus';
import { CreateDriverCommand } from '../../../../application/commands/definitions/Driver/AddDriverCommand';
import { UpdateDriverCommand } from '../../../../application/commands/definitions/Driver/UpdateDriverCommand';
import { DeleteDriverCommand } from '../../../../application/commands/definitions/Driver/DeleteDriverCommand';
import { GetDriverQuery } from '../../../../application/queries/definitions/Driver/GetDriverQuery';
import { GetAllDriverQuery } from '../../../../application/queries/definitions/Driver/GetDriverQuery';
import * as jwt from "jsonwebtoken";
import { JwtPayload } from "../../nest/guards/JwtAuthGuard";

const router = express.Router();
const commandBus = new CommandBus();
const queryBus = new QueryBus();

const protectRoute = (req: Request, res: Response, next: NextFunction): void => {
  console.log("\n [Middleware] Vérification de l'authentification...");

  const token = req.headers.authorization?.split(" ")[1];
  console.log(" Token extrait:", token || "Aucun token trouvé");

  if (!token) {
    console.error(" Unauthorized: No token provided");
    res.status(401).json({ error: "Unauthorized: No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "jwt_secret_key") as JwtPayload;
    console.log(" Token décodé avec succès:", decoded);

    if (!decoded.userId || !decoded.role) {
      console.error(" Erreur: Structure du token invalide", decoded);
      res.status(403).json({ error: "Unauthorized: Invalid token structure" });
      return;
    }

    req.user = decoded;
    console.log(" Utilisateur attaché à la requête:", req.user);
    next();
  } catch (error) {
    console.error(" Erreur lors de la vérification du token:", error);
    res.status(401).json({ error: "Unauthorized: Invalid token" });
    return;
  }
};

router.post('/', protectRoute, async (req: Request, res: Response) => {
  console.log("Received driver data:", req.body);
  const { licenseNumber, experienceLevel, dateOfBirth, clientId, motorcycleId } = req.body;
  const command = new CreateDriverCommand(licenseNumber, experienceLevel, dateOfBirth, clientId, motorcycleId);
  try {
    const result = await commandBus.execute(command);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.put('/:id', protectRoute, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { licenseNumber, experienceLevel, dateOfBirth, clientId, motorcycleId } = req.body;
  const command = new UpdateDriverCommand(id, licenseNumber, experienceLevel, dateOfBirth, clientId, motorcycleId);
  try {
    const result = await commandBus.execute(command);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.delete('/:id', protectRoute, async (req: Request, res: Response) => {
  const { id } = req.params;
  const command = new DeleteDriverCommand(id);
  try {
    await commandBus.execute(command);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.get('/:id', protectRoute, async (req: Request, res: Response) => {
  const { id } = req.params;
  const query = new GetDriverQuery(id);
  try {
    const result = await queryBus.execute(query);
    if (!result) {
      res.status(404).json({ error: 'Driver not found' });
    } else {
      res.status(200).json(result);
    }
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.get('/', protectRoute, async (req: Request, res: Response) => {
  const query = new GetAllDriverQuery();
  try {
    const result = await queryBus.execute(query);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
