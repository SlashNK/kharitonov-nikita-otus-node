import { IsString, IsOptional, IsEmail, IsEnum } from 'class-validator';
import { Role } from '../enums/roles.enum';
import { OmitType, PartialType } from '@nestjs/mapped-types';

export class User implements User {
  @IsString()
  @IsOptional()
  id?: string;
  @IsString()
  username: string;
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @IsString()
  @IsOptional()
  refreshToken?: string;
  @IsEnum(Role)
  role: Role;
}

export class CreateUserDto extends OmitType(User, ['id'] as const) {}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
