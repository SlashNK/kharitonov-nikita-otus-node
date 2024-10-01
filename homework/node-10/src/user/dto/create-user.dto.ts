import { IsString, IsEmail, MinLength } from 'class-validator';
import { IUser } from 'src/shared/interfaces/user.interface';

export class CreateUserDto
  implements Omit<IUser, 'id' | 'refreshToken' | 'role'>
{
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
