import { IsString, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateExerciseDto } from './create-exercise.dto';
import { IExercise } from 'src/shared/interfaces/exercise.interface';

export class UpdateExerciseDto
  extends PartialType(CreateExerciseDto)
  implements Partial<IExercise>
{
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  type?: string;
}
