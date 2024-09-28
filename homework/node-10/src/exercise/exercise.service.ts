import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtPayload } from 'src/auth/jwt/jwt-payload.interface';
import { Exercise } from 'src/shared/entities/exercise.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,
  ) {}

  // Create a new exercise
  async create(createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    const newExercise = this.exerciseRepository.create(createExerciseDto);
    return this.exerciseRepository.save(newExercise);
  }

  // Get all exercises
  async findAll(): Promise<Exercise[]> {
    return this.exerciseRepository.find({ relations: ['user'] });
  }

  // Find exercises for a specific user (based on JWT payload)
  async findForUser(user?: JwtPayload): Promise<Exercise[]> {
    return this.exerciseRepository.find({
      where: { user: { username: user.username } },
      relations: ['user'],
    });
  }

  // Get a single exercise by ID
  async findOne(id: string): Promise<Exercise> {
    const exercise = await this.exerciseRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }
    return exercise;
  }

  // Update an exercise by ID
  async update(
    id: string,
    updateExerciseDto: UpdateExerciseDto,
  ): Promise<Exercise> {
    const exercise = await this.findOne(id);
    Object.assign(exercise, updateExerciseDto);
    return this.exerciseRepository.save(exercise);
  }

  // Delete an exercise by ID
  async remove(id: string): Promise<void> {
    const result = await this.exerciseRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }
  }
}
