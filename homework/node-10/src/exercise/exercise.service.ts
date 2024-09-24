import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtPayload } from 'src/auth/jwt/jwt-payload.interface';
import {
  Exercise,
  CreateExerciseDto,
  UpdateExerciseDto,
} from 'src/shared/entities/exercise.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ExerciseService {
  private Exercises: Exercise[] = [];

  create(createExerciseDto: CreateExerciseDto): Exercise {
    const newExercise: Exercise = {
      id: uuidv4(),
      ...createExerciseDto,
    };
    this.Exercises.push(newExercise);
    return newExercise;
  }

  async findAll(): Promise<Exercise[]> {
    return this.Exercises;
  }
  async findForUser(user?: JwtPayload): Promise<Exercise[]> {
    return this.Exercises.filter(
      (exercise) => exercise.author === user.username,
    );
  }

  async findOne(id: string): Promise<Exercise> {
    const Exercise = this.Exercises.find((Exercise) => Exercise.id === id);
    if (!Exercise) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }
    return Exercise;
  }

  async update(
    id: string,
    updateExerciseDto: UpdateExerciseDto,
  ): Promise<Exercise> {
    const Exercise = this.findOne(id);
    Object.assign(Exercise, updateExerciseDto);
    return Exercise;
  }

  async remove(id: string): Promise<void> {
    const ExerciseIndex = this.Exercises.findIndex(
      (Exercise) => Exercise.id === id,
    );
    if (ExerciseIndex === -1) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }
    this.Exercises.splice(ExerciseIndex, 1);
  }
}
