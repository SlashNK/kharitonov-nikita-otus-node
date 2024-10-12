import { Module } from '@nestjs/common';
import { ExerciseController } from './exercise.controller';
import { ExerciseService } from './exercise.service';
import { Exercise } from 'src/shared/entities/exercise.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExerciseResolver } from './exercise.resolver';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([Exercise]), SharedModule],
  controllers: [ExerciseController],
  providers: [ExerciseService, ExerciseResolver],
})
export class ExerciseModule {}
