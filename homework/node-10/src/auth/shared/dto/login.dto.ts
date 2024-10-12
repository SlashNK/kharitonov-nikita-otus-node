import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class LoginDto {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  username: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  password: string;
}
