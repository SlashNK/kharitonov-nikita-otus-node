import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ExerciseService } from './exercise.service';
import { Exercise } from 'src/shared/entities/exercise.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/shared/guards/gql-auth.guard';

@Resolver(() => Exercise)
export class ExerciseResolver {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Query(() => [Exercise])
  async findAll(): Promise<Exercise[]> {
    return this.exerciseService.findAll();
  }

  @Query(() => Exercise)
  async findOne(@Args('id') id: string): Promise<Exercise> {
    return this.exerciseService.findOne(id);
  }

  @Mutation(() => Exercise)
  @UseGuards(GqlAuthGuard)
  async create(
    @Args('createExerciseDto') createExerciseDto: CreateExerciseDto,
  ): Promise<Exercise> {
    return this.exerciseService.create(createExerciseDto);
  }

  @Mutation(() => Exercise)
  @UseGuards(GqlAuthGuard)
  async update(
    @Args('id') id: string,
    @Args('updateExerciseDto') updateExerciseDto: UpdateExerciseDto,
  ): Promise<Exercise> {
    return this.exerciseService.update(id, updateExerciseDto);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async remove(@Args('id') id: string): Promise<boolean> {
    await this.exerciseService.remove(id);
    return true;
  }
}
