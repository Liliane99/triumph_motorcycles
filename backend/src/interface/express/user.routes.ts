import { Router } from 'express';
import { CreateUserCommand } from '../../application/commands/CreateUserCommand';
import { CreateUserHandler } from '../../application/handlers/CreateUserHandler';

const router = Router();
const handler = new CreateUserHandler();

router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await handler.execute(new CreateUserCommand(name, email));
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
});

export default router;
