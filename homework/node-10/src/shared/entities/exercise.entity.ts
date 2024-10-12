import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { IExercise } from '../interfaces/exercise.interface';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Exercise implements IExercise {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column()
  type: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.exercises, { eager: false })
  user: User;
}
