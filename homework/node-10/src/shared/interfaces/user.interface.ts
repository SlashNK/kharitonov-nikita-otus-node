import { Role } from '../enums/roles.enum';

export interface IUser {
  id: string;
  username: string;
  email: string;
  password: string;
  refreshToken?: string;
  role: Role;
}
