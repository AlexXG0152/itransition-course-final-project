import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from '../comments/entities/comment.entity';
import { Review } from '../reviews/entities/review.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment)
    private commentRepository: typeof Comment,
    private userService: UsersService,
  ) {}

  exclude = [
    'createdAt',
    'updatedAt',
    'deletedAt',
    'banreason',
    'password',
    'unbanreason',
    'email',
  ];

  async create(createCommentDto: CreateCommentDto) {
    try {
      const comment = await this.commentRepository.create(createCommentDto);
      const user = await this.userService.findOne(comment.userId);

      return {
        ...comment.dataValues,
        user: {
          id: user.id,
          name: user.name,
          banned: user.banned,
          receivedLikes: user.receivedLikes,
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findAll() {
    try {
      return this.commentRepository.findAll({
        include: [
          {
            model: Review,
            as: 'review',
            attributes: {
              exclude: ['deletedAt'],
            },
            include: [
              {
                model: User,
                as: 'user',
                attributes: {
                  exclude: this.exclude,
                },
              },
            ],
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  }

  async findOne(id: number) {
    try {
      return this.commentRepository.findByPk(id, {
        include: [
          {
            model: Review,
            as: 'review',
            attributes: {
              exclude: ['deletedAt'],
            },
            include: [
              {
                model: User,
                as: 'user',
                attributes: {
                  exclude: this.exclude,
                },
              },
            ],
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    try {
      return await this.commentRepository.update(updateCommentDto, {
        where: { id },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async remove(id: number) {
    return this.commentRepository.destroy({ where: { id } });
  }
}
