import express, { Request, Response, NextFunction } from 'express';
import { CommandBus } from '../cqrs/CommandBus';
import { QueryBus } from '../cqrs/QueryBus';
import { CreateRentalCommand } from '../../../../application/commands/definitions/Rental/AddRentalCommand';
import { UpdateRentalCommand } from '../../../../application/commands/definitions/Rental/UpdateRentalCommand';
import { DeleteRentalCommand } from '../../../../application/commands/definitions/Rental/DeleteRentalCommand';
import { GetRentalQuery } from '../../../../application/queries/definitions/Rental/GetRentalQuery';
import { GetAllRentalQuery } from '../../../../application/queries/definitions/Rental/GetRentalQuery';
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
  try {
    console.log("\n [POST] Création d'une location - Données reçues:", req.body);

    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized: User not found" });
      return;
    }

    const { reference, rentalDate, price, motorcycleId } = req.body;
    const command = new CreateRentalCommand(reference, rentalDate, price, userId, motorcycleId);

    console.log(" Commande envoyée au bus:", command);
    const result = await commandBus.execute(command);

    console.log(" Location créée avec succès:", result);
    res.status(201).json(result);
  } catch (err) {
    console.error(" Erreur lors de la création d'une location:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});


router.put('/:id', protectRoute, async (req: Request, res: Response) => {
  try {
    console.log("\n [PUT] Mise à jour d'une location - Données reçues:", req.body);

    const { id } = req.params;
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized: User not found" });
      return;
    }

    const { reference, rentalDate, price, motorcycleId } = req.body;
    const command = new UpdateRentalCommand(id, reference, rentalDate, price, userId, motorcycleId);

    console.log(" Commande envoyée au bus:", command);
    const result = await commandBus.execute(command);

    console.log(" Location mise à jour avec succès:", result);
    res.status(200).json(result);
  } catch (err) {
    console.error(" Erreur lors de la mise à jour d'une location:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});


router.delete('/:id', protectRoute, async (req: Request, res: Response) => {
  try {
    console.log("\n [DELETE] Suppression d'une location - ID:", req.params.id);

    const { id } = req.params;
    const command = new DeleteRentalCommand(id);

    console.log(" Commande envoyée au bus:", command);
    await commandBus.execute(command);

    console.log(" Location supprimée avec succès");
    res.status(204).send();
  } catch (err) {
    console.error(" Erreur lors de la suppression d'une location:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});


router.get('/:id', protectRoute, async (req: Request, res: Response) => {
  try {
    console.log("\n [GET] Récupération d'une location - ID:", req.params.id);

    const { id } = req.params;
    const query = new GetRentalQuery(id);

    console.log(" Requête envoyée au bus:", query);
    const result = await queryBus.execute(query);

    if (!result) {
      console.warn("⚠️ Location non trouvée");
      res.status(404).json({ error: 'Rental not found' });
      return;
    }

    console.log(" Location récupérée avec succès:", result);
    res.status(200).json(result);
  } catch (err) {
    console.error(" Erreur lors de la récupération d'une location:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});


router.get('/', protectRoute, async (req: Request, res: Response) => {
  try {
    console.log("\n [GET] Récupération de toutes les locations");

    const query = new GetAllRentalQuery();
    console.log(" Requête envoyée au bus:", query);

    const result = await queryBus.execute(query);

    console.log(" Liste des locations récupérée avec succès:", result);
    res.status(200).json(result);
  } catch (err) {
    console.error(" Erreur lors de la récupération des locations:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
