import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsEmail, MinLength } from 'class-validator';
import { Role } from 'src/shared/enums/roles.enum';
import { IUser } from 'src/shared/interfaces/user.interface';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto
  extends PartialType(CreateUserDto)
  implements Partial<IUser>
{
  @IsString()
  @IsOptional()
  username?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsOptional()
  role?: Role;

  @IsString()
  @IsOptional()
  refreshToken?: IUser['refreshToken'];
}
