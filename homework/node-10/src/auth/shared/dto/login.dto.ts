import { IsNotEmpty, IsString } from 'class-validator';
import { IUser } from 'src/shared/interfaces/user.interface';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  username: IUser['username'];

  @IsNotEmpty()
  @IsString()
  password: IUser['password'];
}
