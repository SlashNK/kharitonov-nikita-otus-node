import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExerciseModule } from 'src/exercise/exercise.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from 'src/shared/entities/exercise.entity';
import { User } from 'src/shared/entities/user.entity';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    UserModule,
    AuthModule,
    ExerciseModule,
    ConfigModule.forRoot({
      envFilePath: ['env', '.env.db'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, Exercise],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([User, Exercise]),
  ],
})
export class AppModule {}
