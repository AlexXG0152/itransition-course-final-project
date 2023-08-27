import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { configuration } from 'config/configuration';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { User } from './app/users/entities/user.entity';
import { UsersModule } from './app/users/users.module';
import { Role } from './app/roles/entities/role.entity';
import { RolesModule } from './app/roles/roles.module';
import { UserRoles } from './app/roles/entities/user-roles.entity';
import { AuthModule } from './app/auth/auth.module';
import { Review } from './app/reviews/entities/review.entity';
import { ReviewsModule } from './app/reviews/reviews.module';
import { Product } from './app/product/entities/product.entity';
import { ProductModule } from './app/product/product.module';
import { Rating } from './app/product/entities/rating.entity';
import { Like } from './app/reviews/entities/like.entity';
import { Comment } from './app/comments/entities/comment.entity';
import { FirebaseModule } from './app/firebase/firebase.module';
import { CommentsModule } from './app/comments/comments.module';

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
      models: [User, Role, UserRoles, Review, Product, Rating, Like, Comment],
      autoLoadModels: true,
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    ProductModule,
    ReviewsModule,
    CommentsModule,
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
