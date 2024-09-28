import { IUser } from './user.interface';

export interface IExercise {
  id: string;
  name: string;
  description: string;
  type: string;
  user: IUser;
}
