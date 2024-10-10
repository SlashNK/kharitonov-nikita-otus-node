import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsEmail, MinLength } from 'class-validator';
import { Role } from 'src/shared/enums/roles.enum';
import { IUser } from 'src/shared/interfaces/user.interface';
import { CreateUserDto } from './create-user.dto';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateUserDto
  extends PartialType(CreateUserDto)
  implements Partial<IUser>
{
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  username?: string;

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @Field(() => Role, { nullable: true })
  @IsOptional()
  role?: Role;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  refreshToken?: string;
}
