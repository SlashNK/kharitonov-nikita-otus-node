import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { IExercise } from '../interfaces/exercise.interface';

@Entity()
export class Exercise implements IExercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  type: string;

  @ManyToOne(() => User, (user) => user.exercises, { eager: false })
  user: User;
}
