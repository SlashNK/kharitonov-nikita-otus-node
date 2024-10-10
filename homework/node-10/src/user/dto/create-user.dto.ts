import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsEmail, MinLength } from 'class-validator';
import { IUser } from 'src/shared/interfaces/user.interface';

@InputType()
export class CreateUserDto
  implements Omit<IUser, 'id' | 'refreshToken' | 'role'>
{
  @Field()
  @IsString()
  username: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;
}
