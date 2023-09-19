import { Module, forwardRef } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { Review } from '../reviews/entities/review.entity';
import { RolesModule } from '../roles/roles.module';
import { User } from '../users/entities/user.entity';
import { Comment } from '../comments/entities/comment.entity';
import { CommentsGateway } from './comments.gateway';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, CommentsGateway],
  imports: [
    SequelizeModule.forFeature([User, Review, Comment]),
    RolesModule,
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
  ],
  exports: [CommentsService],
})
export class CommentsModule {}
