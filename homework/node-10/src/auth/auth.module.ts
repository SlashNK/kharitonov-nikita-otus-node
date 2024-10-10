import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt/jwt-strategy';
import { UserModule } from 'src/user/user.module';
import { AuthResolver } from './auth.resolver'; // Import AuthResolver
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule, UserModule],
  providers: [AuthService, JwtStrategy, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
