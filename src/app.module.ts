import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { configuration } from 'config/configuration';
import { User } from './app/users/entities/user.entity';
import { UsersModule } from './app/users/users.module';
import { Role } from './app/roles/entities/role.entity';
import { RolesModule } from './app/roles/roles.module';
import { UserRoles } from './app/roles/entities/user-roles.entity';
import { AuthModule } from './app/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/config/.env.${process.env.NODE_ENV}`,
      isGlobal: true,
      load: [configuration],
      cache: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      models: [User, Role, UserRoles],
      autoLoadModels: true,
    }),
    AuthModule,
    UsersModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
