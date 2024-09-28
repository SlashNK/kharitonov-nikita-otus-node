import { IsString } from 'class-validator';
import { IExercise } from 'src/shared/interfaces/exercise.interface';
import { IUser } from 'src/shared/interfaces/user.interface';

export class CreateExerciseDto implements Omit<IExercise, 'id' | 'user'> {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  type: string;

  user: IUser;
}
