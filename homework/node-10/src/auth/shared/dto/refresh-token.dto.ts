import { IsNotEmpty, IsString } from 'class-validator';
import { IUser } from 'src/shared/interfaces/user.interface';

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: IUser['refreshToken'];
}
