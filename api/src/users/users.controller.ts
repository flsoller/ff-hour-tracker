import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { User } from './models/user.model';
import { UsersService } from './users.service';

interface CreateUser {
  firstName: string;
  lastName: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUser: CreateUser): Promise<User> {
    return this.usersService.create(createUser.firstName, createUser.lastName);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
