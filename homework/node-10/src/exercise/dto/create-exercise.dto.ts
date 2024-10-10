import { IsString } from 'class-validator';
import { IExercise } from 'src/shared/interfaces/exercise.interface';
import { InputType, Field } from '@nestjs/graphql';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@InputType()
export class CreateExerciseDto implements Omit<IExercise, 'id' | 'user'> {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  description: string;

  @Field()
  @IsString()
  type: string;

  @Field(() => CreateUserDto, { nullable: true })
  user: CreateUserDto;
}
