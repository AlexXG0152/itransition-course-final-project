import { Module, forwardRef } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Review } from './entities/review.entity';
import { RolesModule } from '../roles/roles.module';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/entities/user.entity';
import { Product } from '../product/entities/product.entity';
import { Like } from './entities/like.entity';
import { Category } from '../product/entities/category.entity';
import { Subcategory } from '../product/entities/subcategory.entity';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
  imports: [
    SequelizeModule.forFeature([
      User,
      Review,
      Product,
      Like,
      Category,
      Subcategory,
    ]),
    RolesModule,
    forwardRef(() => AuthModule),
  ],
  exports: [ReviewsService],
})
export class ReviewsModule {}
