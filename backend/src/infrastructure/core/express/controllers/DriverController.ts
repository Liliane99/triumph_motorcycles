import express, { Request, Response } from 'express';
import { CommandBus } from '../cqrs/CommandBus';
import { QueryBus } from '../cqrs/QueryBus';
import { CreateDriverCommand } from '../../../../application/commands/definitions/Driver/AddDriverCommand';
import { UpdateDriverCommand } from '../../../../application/commands/definitions/Driver/UpdateDriverCommand';
import { DeleteDriverCommand } from '../../../../application/commands/definitions/Driver/DeleteDriverCommand';
import { GetDriverQuery } from '../../../../application/queries/definitions/Driver/GetDriverQuery';
import { GetAllDriverQuery } from '../../../../application/queries/definitions/Driver/GetDriverQuery';

const router = express.Router();
const commandBus = new CommandBus();
const queryBus = new QueryBus();

router.post('/', async (req: Request, res: Response) => {
  console.log("Received driver data:", req.body);

  const { licenseNumber, experienceLevel, dateOfBirth, clientId, motorcycleId } = req.body;

  console.log("Parsed License Number:", licenseNumber, " Type of License Number:", typeof licenseNumber);

  const command = new CreateDriverCommand(licenseNumber, experienceLevel, dateOfBirth, clientId, motorcycleId);

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
  const { licenseNumber, experienceLevel, dateOfBirth, clientId, motorcycleId } = req.body;

  console.log(`Updating driver with ID: ${id}`);
  console.log("Received data:", req.body);

  const command = new UpdateDriverCommand(id, licenseNumber, experienceLevel, dateOfBirth, clientId, motorcycleId);

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

  console.log(`Deleting driver with ID: ${id}`);
  const command = new DeleteDriverCommand(id);

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
  console.log(`Fetching driver with ID: ${id}`);
  const query = new GetDriverQuery(id);

  try {
    console.log("Executing get query...");
    const result = await queryBus.execute(query);
    if (!result) {
      console.log("Driver not found.");
      res.status(404).json({ error: 'Driver not found' });
    } else {
      console.log("Driver found:", result);
      res.status(200).json(result);
    }
  } catch (err) {
    const error = err as Error;
    console.error("Error during get query execution:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req: Request, res: Response) => {
  console.log("Fetching all drivers...");
  const query = new GetAllDriverQuery();

  try {
    console.log("Executing get all query...");
    const result = await queryBus.execute(query);
    console.log("Drivers found:", result);
    res.status(200).json(result);
  } catch (err) {
    const error = err as Error;
    console.error("Error during get all query execution:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
