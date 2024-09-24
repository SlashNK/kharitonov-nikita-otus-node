import { Injectable, NotFoundException } from '@nestjs/common';
import {
  User,
  CreateUserDto,
  UpdateUserDto,
} from 'src/shared/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  private users: User[] = [];

  create(createUserDto: CreateUserDto): User {
    const newUser: User = {
      id: uuidv4(), // Generate a unique ID
      ...createUserDto,
    };
    this.users.push(newUser);
    return newUser;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
  findByRefreshToken(refreshToken: string): User | undefined {
    return this.users.find((user) => user.refreshToken === refreshToken);
  }
  findByUsername(userName: string): User | undefined {
    return this.users.find((user) => user.username === userName);
  }
  findByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email);
  }

  update(id: string, updateUserDto: UpdateUserDto): User {
    const user = this.findOne(id);
    Object.assign(user, updateUserDto);
    return user;
  }

  remove(id: string): void {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.users.splice(userIndex, 1);
  }
}
