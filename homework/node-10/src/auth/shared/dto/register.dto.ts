import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from 'src/shared/entities/user.entity';

export class RegisterDto extends OmitType(CreateUserDto, ['role'] as const) {}
