import { Module, forwardRef } from '@nestjs/common';
import { ProductsService } from './product.service';
import { ProductsController } from './product.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { Review } from '../reviews/entities/review.entity';
import { RolesModule } from '../roles/roles.module';
import { User } from '../users/entities/user.entity';
import { Product } from './entities/product.entity';
import { Rating } from './entities/rating.entity';
import { Like } from '../reviews/entities/like.entity';
import { Category } from './entities/category.entity';
import { Subcategory } from './entities/subcategory.entity';
import { CategoryService } from './category.service';
import { SubcategoryService } from './subcategory.service';
import { RatingService } from './rating.service';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    CategoryService,
    SubcategoryService,
    RatingService,
  ],
  imports: [
    SequelizeModule.forFeature([
      User,
      Review,
      Product,
      Rating,
      Like,
      Category,
      Subcategory,
    ]),
    RolesModule,
    forwardRef(() => AuthModule),
  ],
  exports: [
    ProductsService,
    CategoryService,
    SubcategoryService,
    RatingService,
  ],
})
export class ProductModule {}
