import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { Exercise } from 'src/shared/entities/exercise.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}
  //TODO: for user, for admin
  @Get()
  findAll(): Promise<Exercise[]> {
    return this.exerciseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Exercise> {
    return this.exerciseService.findOne(id);
  }

  @Post()
  create(@Body() createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    //TODO: user
    return this.exerciseService.create(createExerciseDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ): Promise<Exercise> {
    return this.exerciseService.update(id, updateExerciseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.exerciseService.remove(id);
  }
}
