import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import {
  CreateExerciseDto,
  Exercise,
  UpdateExerciseDto,
} from 'src/shared/entities/exercise.entity';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/enums/roles.enum';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { JwtPayload } from 'src/auth/jwt/jwt-payload.interface';
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.USER)
@Controller('exercise')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Post()
  async create(
    @Body() createExerciseDto: CreateExerciseDto,
    @Req() req,
  ): Promise<Exercise> {
    const user: JwtPayload = req.user;
    console.log(user);
    return await this.exerciseService.create({
      ...createExerciseDto,
      author: user.username,
    });
  }

  @Get('user')
  async findForUser(@Req() req): Promise<Exercise[]> {
    const userName = req.user.username;
    return await this.exerciseService.findForUser(userName);
  }
  @Roles(Role.ADMIN)
  @Get()
  async findAll(): Promise<Exercise[]> {
    return await this.exerciseService.findAll();
  }
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req): Promise<Exercise> {
    const user: JwtPayload = req.user;
    const exercise = await this.exerciseService.findOne(id);
    if (exercise.author === user.username || user.role === Role.ADMIN) {
      return exercise;
    } else {
      throw new ForbiddenException('Access denied');
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
    @Req() req,
  ): Promise<Exercise> {
    const user: JwtPayload = req.user;
    const exercise = await this.exerciseService.findOne(id);
    if (exercise.author !== user.username && user.role !== Role.ADMIN) {
      throw new ForbiddenException('Access denied');
    }
    return this.exerciseService.update(id, updateExerciseDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req): Promise<void> {
    const user: JwtPayload = req.user;
    const exercise = await this.exerciseService.findOne(id);
    if (exercise.author !== user.username && user.role !== Role.ADMIN) {
      throw new ForbiddenException('Access denied');
    }
    return this.exerciseService.remove(id);
  }
}
