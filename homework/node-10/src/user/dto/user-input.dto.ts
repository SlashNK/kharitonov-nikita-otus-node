import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsEmail } from 'class-validator';

@InputType()
export class UserInputDto {
  @Field()
  @IsString()
  username: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  password: string;
}
