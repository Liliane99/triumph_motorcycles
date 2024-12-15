import { Router } from 'express';
import { CreateUserCommand } from '../../application/commands/CreateUserCommand';
import { CreateUserHandler } from '../../application/handlers/CreateUserHandler';

const router = Router();
const handler = new CreateUserHandler();

router.post('/users', async (req, res) => {
  const { name, email } = req.body;
  const user = await handler.execute(new CreateUserCommand(name, email));
  res.status(201).json(user);
});

export default router;
