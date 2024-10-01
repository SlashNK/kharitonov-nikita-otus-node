import { Role } from 'src/shared/enums/roles.enum';

export interface JwtPayload {
  username: string;
  email: string;
  role: Role;
}
