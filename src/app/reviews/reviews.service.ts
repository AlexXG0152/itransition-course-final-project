import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { Product } from '../product/entities/product.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Category } from '../product/entities/category.entity';
import { Subcategory } from '../product/entities/subcategory.entity';
import { Tag } from './entities/tag.entity';
import { Like } from './entities/like.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Product) private productRepository: typeof Product,
    @InjectModel(Review) private reviewRepository: typeof Review,
    @InjectModel(Tag) private tagRepository: typeof Tag,
  ) {}

  excludedTimestamps = ['createdAt', 'updatedAt', 'deletedAt'];

  async create(
    req: Request,
    createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    try {
      const userId = req['user'].id;
      if (!createReviewDto.productId) {
        const productTitle = createReviewDto.productTitle;
        const categoryId = createReviewDto.categoryId;
        const subcategoryId = createReviewDto.subcategoryId;
        const product = await this.productRepository.create({
          productTitle,
          categoryId,
          subcategoryId,
        });
        createReviewDto.productId = product.id;
      }

      const review = await this.reviewRepository.create({
        ...createReviewDto,
        userId: userId,
      });

      const tagModels = await Promise.all(
        createReviewDto.tags.map((tagName) =>
          this.tagRepository.findOrCreate({ where: { name: tagName } }),
        ),
      );

      const associatedTags = tagModels.map((tagModel) => tagModel[0]);
      await review.$set('tags', associatedTags);

      return review;
    } catch (error) {
      console.error(error);
    }
  }

  async findOne(id: number) {
    try {
      return await this.reviewRepository.findByPk(id, {
        include: [
          {
            model: Product,
            as: 'product',
            attributes: {
              exclude: this.excludedTimestamps,
            },
          },
          {
            model: Comment,
            as: 'comments',
            attributes: {
              exclude: ['deletedAt'],
            },
            include: [
              {
                model: User,
                as: 'user',
                attributes: {
                  exclude: [
                    'createdAt',
                    'updatedAt',
                    'deletedAt',
                    'banreason',
                    'password',
                    'unbanreason',
                    'email',
                  ],
                },
              },
            ],
          },
          {
            model: Category,
            as: 'categoryID',
            attributes: {
              exclude: this.excludedTimestamps,
            },
          },
          {
            model: Subcategory,
            as: 'subcategoryID',
            attributes: {
              exclude: this.excludedTimestamps,
            },
          },
          {
            model: Tag,
            as: 'tags',
            attributes: {
              exclude: this.excludedTimestamps,
            },
            through: {
              attributes: [],
            },
          },
          {
            model: User,
            as: 'user',
            attributes: {
              exclude: [
                'password',
                'email',
                'banreason',
                'unbanreason',
                'createdAt',
                'updatedAt',
                'deletedAt',
              ],
            },
          },
        ],
        group: ['Review.id', 'comments.id', 'tags.id'],
      });
    } catch (error) {
      console.error(error);
      throw new NotFoundException();
    }
  }

  async getReviewsByParams(params) {
    try {
      const whereClause = {};

      if (params.categoryId) {
        whereClause['categoryId'] = params.categoryId;
      }

      if (params.subcategoryId) {
        whereClause['subcategoryId'] = params.subcategoryId;
      }

      return await this.reviewRepository.findAndCountAll({
        limit: +params.quantity,
        offset: +params.offset,
        order: [[params.order, params.direction]],
        attributes: {
          exclude: ['deletedAt'],
        },
        include: [
          {
            model: Product,
            as: 'product',
            attributes: {
              exclude: this.excludedTimestamps,
            },
          },
        ],
        where: whereClause,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    try {
      const review = await this.reviewRepository.findByPk(id);
      if (!review) return;

      await this.reviewRepository.update(updateReviewDto, { where: { id } });

      if (updateReviewDto.tags && updateReviewDto.tags.length > 0) {
        const tagModels = await Promise.all(
          updateReviewDto.tags.map((tagName) =>
            this.tagRepository.findOrCreate({ where: { name: tagName } }),
          ),
        );

        const associatedTags = tagModels.map((tagModel) => tagModel[0]);
        await review.$set('tags', associatedTags);
      }

      await review.save();

      return review;
    } catch (error) {
      console.error(error);
    }
  }

  async remove(id: number) {
    try {
      return await this.reviewRepository.destroy({ where: { id } });
    } catch (error) {
      console.error(error);
    }
  }

  async findAll(): Promise<Review[]> {
    try {
      return await this.reviewRepository.findAll({
        include: [
          {
            model: Product,
            as: 'product',
            attributes: {
              exclude: this.excludedTimestamps,
            },
          },
          {
            model: Comment,
            as: 'comments',
            attributes: {
              exclude: this.excludedTimestamps,
            },
          },
          {
            model: Category,
            as: 'categoryID',
            attributes: {
              exclude: this.excludedTimestamps,
            },
          },
          {
            model: Subcategory,
            as: 'subcategoryID',
            attributes: {
              exclude: this.excludedTimestamps,
            },
          },
          {
            model: Tag,
            as: 'tags',
            attributes: {
              exclude: this.excludedTimestamps,
            },
            through: {
              attributes: [],
            },
          },
          {
            model: Like,
            as: 'likes',
            attributes: {
              exclude: this.excludedTimestamps,
            },
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  }
}
