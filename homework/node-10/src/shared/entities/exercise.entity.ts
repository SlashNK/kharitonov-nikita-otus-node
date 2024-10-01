import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { User } from './user.entity';

export class Exercise {
  @IsString()
  @IsOptional()
  id?: string;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsString()
  @IsNotEmpty()
  type: string;
  @IsString()
  @IsOptional()
  author: User['username'];
}

export class CreateExerciseDto extends OmitType(Exercise, ['id'] as const) {}

export class UpdateExerciseDto extends PartialType(CreateExerciseDto) {}
