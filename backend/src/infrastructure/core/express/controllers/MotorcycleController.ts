import express, { Request, Response } from 'express';
import { CommandBus } from '../cqrs/CommandBus';
import { QueryBus } from '../cqrs/QueryBus';
import { CreateMotorcycleCommand } from '../../../../application/commands/definitions/Motorcycle/AddMotorcycleCommand';
import { UpdateMotorcycleCommand } from '../../../../application/commands/definitions/Motorcycle/UpdateMotorcycleCommand';
import { DeleteMotorcycleCommand } from '../../../../application/commands/definitions/Motorcycle/DeleteMotorcycleCommand';
import { GetMotorcycleQuery } from '../../../../application/queries/definitions/Motorcycle/GetMotorcycleQuery';
import { GetAllMotorcyclesQuery } from '../../../../application/queries/definitions/Motorcycle/GetMotorcycleQuery';



const router = express.Router();
const commandBus = new CommandBus();
const queryBus = new QueryBus();

// Créer une moto
router.post('/', async (req: Request, res: Response) => {
  console.log("Received data:", req.body); 

  const { brand, model, year, licensePlate, kilometers } = req.body;

  console.log("Extracted fields:", { brand, model, year, licensePlate, kilometers });  

  const command = new CreateMotorcycleCommand(brand, model, year, licensePlate, kilometers);
  
  try {
    const result = await commandBus.execute(command);
    res.status(201).json(result);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
});


// Mettre à jour une moto
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { brand, model, year, licensePlate, kilometers } = req.body;
  const command = new UpdateMotorcycleCommand(id, brand, model, year, licensePlate, kilometers);

  try {
    const result = await commandBus.execute(command);
    res.status(200).json(result);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
});

// Supprimer une moto
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const command = new DeleteMotorcycleCommand(id);

  try {
    await commandBus.execute(command);
    res.status(204).send();
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
});

// Obtenir une moto
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const query = new GetMotorcycleQuery(id);

  try {
    const result = await queryBus.execute(query);
    if (!result) {
      res.status(404).json({ error: 'Motorcycle not found' });
    } else {
      res.status(200).json(result);
    }
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
});

// Obtenir toutes les motos
router.get('/', async (req: Request, res: Response) => {
  const query = new GetAllMotorcyclesQuery(); 
  try {
    const result = await queryBus.execute(query); 
    res.status(200).json(result);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
});

export default router; 
