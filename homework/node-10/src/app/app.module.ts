import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ExerciseModule } from 'src/exercise/exercise.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [UserModule, AuthModule, ExerciseModule, ConfigModule.forRoot()],
})
export class AppModule {}
