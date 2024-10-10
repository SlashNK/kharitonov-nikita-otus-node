import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Role } from '../enums/roles.enum';
import { IUser } from '../interfaces/user.interface';
import { Exercise } from './exercise.entity';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class User implements IUser {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  username: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column()
  password: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  refreshToken?: string;

  @Field(() => Role)
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Field(() => [Exercise])
  @OneToMany(() => Exercise, (exercise) => exercise.user, { eager: true })
  exercises: Exercise[];
}
