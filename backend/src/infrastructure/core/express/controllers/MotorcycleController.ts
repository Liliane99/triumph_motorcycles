import express, { Request, Response, NextFunction } from 'express';
import { CommandBus } from '../cqrs/CommandBus';
import { QueryBus } from '../cqrs/QueryBus';
import { CreateMotorcycleCommand } from '../../../../application/commands/definitions/Motorcycle/AddMotorcycleCommand';
import { UpdateMotorcycleCommand } from '../../../../application/commands/definitions/Motorcycle/UpdateMotorcycleCommand';
import { DeleteMotorcycleCommand } from '../../../../application/commands/definitions/Motorcycle/DeleteMotorcycleCommand';
import { GetMotorcycleQuery } from '../../../../application/queries/definitions/Motorcycle/GetMotorcycleQuery';
import { GetAllMotorcyclesQuery } from '../../../../application/queries/definitions/Motorcycle/GetMotorcycleQuery';
import { JwtPayload } from "../../nest/guards/JwtAuthGuard";
import dotenv from "dotenv";
dotenv.config();

import * as jwt from "jsonwebtoken";

const router = express.Router();
const commandBus = new CommandBus();
const queryBus = new QueryBus();

const protectRoute = (req: Request, res: Response, next: NextFunction): void => {
  console.log("\n [Middleware] Vérification de l'authentification...");

  const token = req.headers.authorization?.split(" ")[1];
  

  if (!token) {
    console.error(" Unauthorized: No token provided");
    res.status(401).json({ error: "Unauthorized: No token provided" });
    return;
  }

  

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "jwt_secret_key") as JwtPayload;
    

    if (!decoded.userId || !decoded.role) {
      
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


router.post('/', protectRoute, async (req: Request, res: Response): Promise<void> => {
  try {
    

    const userId = req.user?.userId;
    

    if (!userId) {
      res.status(401).json({ error: "Unauthorized: User not found" });
      return;
    }

    const { brand, model, purchaseDate, licensePlate, kilometers, warrantyDate, maintenanceInterval, ownerId } = req.body;

    const command = new CreateMotorcycleCommand(
      brand,
      model,
      purchaseDate,
      licensePlate,
      kilometers,
      warrantyDate,
      maintenanceInterval,
      ownerId,
      userId 
    );

    
    const result = await commandBus.execute(command);

    
    res.status(201).json(result);
  } catch (err) {
    console.error(" Erreur lors de la création d'une moto:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});


router.put('/:id', protectRoute, async (req: Request, res: Response): Promise<void> => {
  try {
    

    const { id } = req.params;
    const userId = req.user?.userId;
    

    if (!userId) {
      res.status(401).json({ error: "Unauthorized: User not found" });
      return;
    }

    const { brand, model, date, licensePlate, kilometers, warranty, maintenanceInterval } = req.body;

    const command = new UpdateMotorcycleCommand(
      id,
      brand,
      model,
      date,
      licensePlate,
      kilometers,
      warranty,
      maintenanceInterval,
      userId 
    );

    
    const result = await commandBus.execute(command);

   
    res.status(200).json(result);
  } catch (err) {
    
    res.status(500).json({ error: (err as Error).message });
  }
});


router.delete('/:id', protectRoute, async (req: Request, res: Response): Promise<void> => {
  try {

    const { id } = req.params;
    const command = new DeleteMotorcycleCommand(id);

    
    await commandBus.execute(command);

    
    res.status(204).send();
  } catch (err) {
    
    res.status(500).json({ error: (err as Error).message });
  }
});


router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    

    const { id } = req.params;
    const query = new GetMotorcycleQuery(id);

    
    const result = await queryBus.execute(query);

    if (!result) {
      
      res.status(404).json({ error: 'Motorcycle not found' });
      return;
    }

    
    res.status(200).json(result);
  } catch (err) {
    
    res.status(500).json({ error: (err as Error).message });
  }
});


router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    

    const query = new GetAllMotorcyclesQuery();
    

    const result = await queryBus.execute(query);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
