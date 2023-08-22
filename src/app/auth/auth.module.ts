import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from 'config/configuration';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        secret: String(configuration().jwt.secret),
        signOptions: {
          expiresIn: configuration().jwt.expiresIn,
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}
