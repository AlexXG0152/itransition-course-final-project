import { Module, forwardRef } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Review } from './entities/review.entity';
import { ProductReview } from './entities/product.entity';
import { RolesModule } from '../roles/roles.module';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/entities/user.entity';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
  imports: [
    SequelizeModule.forFeature([User, Review, ProductReview]),
    RolesModule,
    forwardRef(() => AuthModule),
  ],
  exports: [ReviewsService],
})
export class ReviewsModule {}
