import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserCommand } from '../../application/commands/CreateUserCommand';
import { CreateUserHandler } from '../../application/handlers/CreateUserHandler';

@Controller('users')
export class UserController {
  private readonly handler = new CreateUserHandler();

  @Post()
  async createUser(@Body() body: { name: string; email: string }) {
    return await this.handler.execute(new CreateUserCommand(body.name, body.email));
  }
}
