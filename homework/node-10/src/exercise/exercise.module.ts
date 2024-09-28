import { Module } from '@nestjs/common';
import { ExerciseController } from './exercise.controller';
import { ExerciseService } from './exercise.service';
import { Exercise } from 'src/shared/entities/exercise.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Exercise])],
  controllers: [ExerciseController],
  providers: [ExerciseService],
})
export class ExerciseModule {}
