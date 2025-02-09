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

// Créer une moto
router.post('/', protectRoute, async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("\n [POST] Création d'une moto - Données reçues:", req.body);

    const userId = req.user?.userId;
    console.log(" ID de l'utilisateur créateur:", userId || " Non trouvé");

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

    console.log(" Commande envoyée au bus:", command);
    const result = await commandBus.execute(command);

    console.log(" Moto créée avec succès:", result);
    res.status(201).json(result);
  } catch (err) {
    console.error(" Erreur lors de la création d'une moto:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// Mettre à jour une moto
router.put('/:id', protectRoute, async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("\n [PUT] Mise à jour d'une moto - Données reçues:", req.body);

    const { id } = req.params;
    const userId = req.user?.userId;
    console.log(" ID de la moto:", id);
    console.log(" ID de l'utilisateur modificateur:", userId || " Non trouvé");

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

    console.log("🚀 Commande envoyée au bus:", command);
    const result = await commandBus.execute(command);

    console.log(" Moto mise à jour avec succès:", result);
    res.status(200).json(result);
  } catch (err) {
    console.error(" Erreur lors de la mise à jour d'une moto:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// Supprimer une moto
router.delete('/:id', protectRoute, async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("\n🗑️ [DELETE] Suppression d'une moto - ID:", req.params.id);

    const { id } = req.params;
    const command = new DeleteMotorcycleCommand(id);

    console.log(" Commande envoyée au bus:", command);
    await commandBus.execute(command);

    console.log(" Moto supprimée avec succès");
    res.status(204).send();
  } catch (err) {
    console.error(" Erreur lors de la suppression d'une moto:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// Récupérer une moto par ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("\n [GET] Récupération d'une moto - ID:", req.params.id);

    const { id } = req.params;
    const query = new GetMotorcycleQuery(id);

    console.log("🚀 Requête envoyée au bus:", query);
    const result = await queryBus.execute(query);

    if (!result) {
      console.warn("⚠️ Moto non trouvée");
      res.status(404).json({ error: 'Motorcycle not found' });
      return;
    }

    console.log(" Moto récupérée avec succès:", result);
    res.status(200).json(result);
  } catch (err) {
    console.error(" Erreur lors de la récupération d'une moto:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// Récupérer toutes les motos
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("\n [GET] Récupération de toutes les motos");

    const query = new GetAllMotorcyclesQuery();
    console.log("🚀 Requête envoyée au bus:", query);

    const result = await queryBus.execute(query);

    console.log(" Liste des motos récupérée avec succès:", result);
    res.status(200).json(result);
  } catch (err) {
    console.error(" Erreur lors de la récupération des motos:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
