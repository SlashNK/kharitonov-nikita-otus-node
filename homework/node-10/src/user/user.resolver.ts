import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from 'src/shared/entities/user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/enums/roles.enum';
import { GqlAuthGuard } from 'src/shared/guards/gql-auth.guard';

@Resolver(() => User)
@UseGuards(GqlAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async createUser(
    @Args('createUserDto') createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Query(() => [User])
  async findAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Query(() => User)
  async findUser(
    @Args('id', { type: () => String }) id: string,
  ): Promise<User> {
    return this.userService.findOne(id);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id', { type: () => String }) id: string,
    @Args('updateUserDto') updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Mutation(() => Boolean)
  async removeUser(
    @Args('id', { type: () => String }) id: string,
  ): Promise<boolean> {
    await this.userService.remove(id);
    return true;
  }
}
