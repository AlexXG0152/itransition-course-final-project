import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { UserRoles } from '../roles/entities/user-roles.entity';
import { RolesModule } from '../roles/roles.module';
import { AuthModule } from '../auth/auth.module';
import { ProductReview } from '../reviews/entities/product.entity';
import { Review } from '../reviews/entities/review.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Role, UserRoles, Review, ProductReview]),
    RolesModule,
    forwardRef(() => AuthModule),
  ],
  exports: [UsersService],
})
export class UsersModule {}
