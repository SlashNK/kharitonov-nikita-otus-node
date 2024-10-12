import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { InputType } from '@nestjs/graphql';

@InputType()
export class RegisterDto extends CreateUserDto {}
