import { CreateUserCommand } from '../commands/CreateUserCommand';
import { User } from '../../domain/entities/User';
import { Injectable } from '@nestjs/common';
  

export class CreateUserHandler {
  async execute(command: CreateUserCommand): Promise<User> {
    const userId = Math.random().toString(36).substring(2, 15);
    return new User(userId, command.name, command.email);
  }
}