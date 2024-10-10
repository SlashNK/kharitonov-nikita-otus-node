import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

registerEnumType(Role, {
  name: 'Role',
  description: 'The role of the user',
});
