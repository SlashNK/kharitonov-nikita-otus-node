import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthTypeDto {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
