import express, { Request, Response } from 'express';
import { CommandBus } from '../cqrs/CommandBus';
import { QueryBus } from '../cqrs/QueryBus';
import { CreateRentalCommand } from '../../../../application/commands/definitions/Rental/AddRentalCommand';
import { UpdateRentalCommand } from '../../../../application/commands/definitions/Rental/UpdateRentalCommand';
import { DeleteRentalCommand } from '../../../../application/commands/definitions/Rental/DeleteRentalCommand';
import { GetRentalQuery } from '../../../../application/queries/definitions/Rental/GetRentalQuery';
import { GetAllRentalQuery } from '../../../../application/queries/definitions/Rental/GetRentalQuery';

const router = express.Router();
const commandBus = new CommandBus();
const queryBus = new QueryBus();

router.post('/', async (req: Request, res: Response) => {
  console.log("Received rental data:", req.body);

  const { reference, rentalDate, price, userId, motorcycleId } = req.body;

  
  console.log("Parsed Price:", price, " Type of Price:", typeof price);

  const command = new CreateRentalCommand(reference, rentalDate, price, userId, motorcycleId);

  try {
    console.log("Executing command...");
    const result = await commandBus.execute(command);
    console.log("Command executed successfully:", result);
    res.status(201).json(result);
  } catch (err) {
    const error = err as Error;
    console.error("Error during command execution:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reference, rentalDate, price, userId, motorcycleId } = req.body;

  console.log(`Updating rental with ID: ${id}`);
  console.log("Received data:", req.body);

  const command = new UpdateRentalCommand(id, reference, rentalDate, price, userId, motorcycleId);

  try {
    console.log("Executing update command...");
    const result = await commandBus.execute(command);
    console.log("Update command executed successfully:", result);
    res.status(200).json(result);
  } catch (err) {
    const error = err as Error;
    console.error("Error during update command execution:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  console.log(`Deleting rental with ID: ${id}`);
  const command = new DeleteRentalCommand(id);

  try {
    console.log("Executing delete command...");
    await commandBus.execute(command);
    console.log("Delete command executed successfully.");
    res.status(204).send();
  } catch (err) {
    const error = err as Error;
    console.error("Error during delete command execution:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(`Fetching rental with ID: ${id}`);
  const query = new GetRentalQuery(id);

  try {
    console.log("Executing get query...");
    const result = await queryBus.execute(query);
    if (!result) {
      console.log("Rental not found.");
      res.status(404).json({ error: 'Rental not found' });
    } else {
      console.log("Rental found:", result);
      res.status(200).json(result);
    }
  } catch (err) {
    const error = err as Error;
    console.error("Error during get query execution:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req: Request, res: Response) => {
  console.log("Fetching all rentals...");
  const query = new GetAllRentalQuery();

  try {
    console.log("Executing get all query...");
    const result = await queryBus.execute(query);
    console.log("Rentals found:", result);
    res.status(200).json(result);
  } catch (err) {
    const error = err as Error;
    console.error("Error during get all query execution:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
