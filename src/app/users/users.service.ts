import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { RolesService } from '../roles/roles.service';
import { AddRoleToUserDto } from './dto/add-role-to-user.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { UnbanUserDto } from './dto/unban-user.dto';
import { Sequelize } from 'sequelize-typescript';
import { Review } from '../reviews/entities/review.entity';
import { Op } from 'sequelize';
import { IUser } from './interfaces/user.interface';
import { Category } from '../product/entities/category.entity';
import { Product } from '../product/entities/product.entity';
import { Subcategory } from '../product/entities/subcategory.entity';
import { Like } from '../reviews/entities/like.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Rating } from '../product/entities/rating.entity';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private roleService: RolesService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.userRepository.create(createUserDto);
      const role = await this.roleService.findOne('USER');
      user.$set('roles', [role.id]);
      user.roles = [role];
      return user;
    } catch (error) {
      console.error(error);
    }
  }

  async findAll() {
    try {
      const users = await this.userRepository.findAll({
        include: [
          {
            model: Review,
            attributes: [],
            where: { like: { [Op.ne]: null } },
            required: false,
          },
        ],
        attributes: {
          exclude: ['password'],
          include: [
            [
              Sequelize.cast(
                Sequelize.fn('SUM', Sequelize.col('reviews.like')),
                'SIGNED',
              ),
              'totalLikes',
            ],
          ],
        },
        group: ['User.id'],
      });
      return users;
    } catch (error) {
      console.error(error);
    }
  }

  async findOne(id: number): Promise<IUser> {
    try {
      const user: any = await User.findOne({
        where: { id },
        include: { all: true },
        attributes: {
          exclude: ['password', 'banreason', 'unbanreason'],
        },
      });

      if (user) {
        const totalLikes = await Review.sum('like', {
          where: { userId: user.id },
        });
        user.dataValues.totalLikes = totalLikes;
      }

      return user;
    } catch (error) {
      console.error(error);
    }
  }

  async findOneByEmail(email: string) {
    try {
      return await this.userRepository.findOne({
        where: { email },
        include: { all: true },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async findMe(req: any) {
    try {
      const user: any = await User.findOne({
        where: { id: req.user.id },
        include: [
          {
            model: Review,
            as: 'reviews',
            include: [
              {
                model: Category,
                attributes: ['name'],
              },
              {
                model: Subcategory,
                attributes: ['name'],
              },
            ],
          },
          {
            model: Comment,
            as: 'comments',
            attributes: {
              exclude: ['deletedAt'],
            },
            include: [
              {
                model: Review,
                attributes: ['title'],
              },
            ],
          },
          {
            model: Rating,
            as: 'ratings',
            attributes: {
              exclude: ['updatedAt', 'deletedAt'],
            },
            include: [
              {
                model: Product,
                attributes: ['productTitle'],
              },
            ],
          },
          {
            model: Like,
            as: 'likes',
            attributes: {
              exclude: ['id', 'updatedAt', 'deletedAt'],
            },
            include: [
              {
                model: Review,
                attributes: ['title'],
              },
            ],
          },
          {
            model: Role,
            as: 'roles',
          },
        ],
        attributes: {
          exclude: ['password', 'banreason', 'unbanreason'],
        },
      });

      if (user) {
        const totalLikes = await Review.sum('like', {
          where: { userId: user.id },
        });
        user.dataValues.totalLikes = totalLikes;
      }

      return user;
    } catch (error) {
      console.error(error);
    }
  }

  async addRoleToUser(addRoleToUserDto: AddRoleToUserDto) {
    try {
      const user = await this.userRepository.findByPk(addRoleToUserDto.userId);
      const role = this.roleService.findOne(addRoleToUserDto.value);

      if (user && role) {
        await user.$add('role', (await role).id);
        return addRoleToUserDto;
      }

      throw new HttpException("User didn't found", HttpStatus.NOT_FOUND);
    } catch (error) {
      console.error(error);
    }
  }

  async banUser(banUserDto: BanUserDto) {
    try {
      const user = await this.userRepository.findByPk(banUserDto.userId);
      if (!user) {
        throw new HttpException("User didn't found", HttpStatus.NOT_FOUND);
      }
      user.banned = true;
      user.banreason = banUserDto.banreason;

      await user.save();

      return user;
    } catch (error) {
      console.error(error);
    }
  }

  async unbanUser(unbanUserDto: UnbanUserDto) {
    try {
      const user = await this.userRepository.findByPk(unbanUserDto.userId);
      if (!user) {
        throw new HttpException("User didn't found", HttpStatus.NOT_FOUND);
      }
      user.banned = false;
      user.unbanreason = `Unbanned: ${unbanUserDto.unbanreason}`;

      await user.save();

      return user;
    } catch (error) {
      console.error(error);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      return await this.userRepository.update(updateUserDto, {
        where: { id },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async remove(id: number) {
    try {
      return await this.userRepository.destroy({ where: { id } });
    } catch (error) {
      console.error(error);
    }
  }
}
