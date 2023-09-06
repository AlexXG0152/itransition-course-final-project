import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import sequelize from 'sequelize';
import { Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { Product } from '../product/entities/product.entity';
import { Like } from './entities/like.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Category } from '../product/entities/category.entity';
import { Subcategory } from '../product/entities/subcategory.entity';
import { Tag } from './entities/tag.entity';
import { User } from '../users/entities/user.entity';
import { ReviewTag } from './entities/review-tag.entity';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Product) private productRepository: typeof Product,
    @InjectModel(Review) private reviewRepository: typeof Review,
    @InjectModel(Like) private likeRepository: typeof Like,
    @InjectModel(Tag) private tagRepository: typeof Tag,
    @InjectModel(ReviewTag) private reviewTagRepository: typeof ReviewTag,
    @InjectModel(Comment) private commentRepository: typeof Comment,
    @InjectModel(User) private userRepository: typeof User,
  ) {}

  async create(
    req: Request,
    createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    try {
      const userId = req['user'].id;
      if (createReviewDto.productId === 0) {
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

  async findAll(): Promise<Review[]> {
    try {
      return await this.reviewRepository.findAll({
        include: [
          {
            model: Product,
            as: 'product',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
          },
          {
            model: Comment,
            as: 'comments',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
          },
          {
            model: Category,
            as: 'categoryID',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
          },
          {
            model: Subcategory,
            as: 'subcategoryID',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
          },
          {
            model: Tag,
            as: 'tags',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
            through: {
              attributes: [],
            },
          },
        ],
      });
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
              exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
          },
          {
            model: Comment,
            as: 'comments',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
          },
          {
            model: Category,
            as: 'categoryID',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
          },
          {
            model: Subcategory,
            as: 'subcategoryID',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
          },
          {
            model: Tag,
            as: 'tags',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
            through: {
              attributes: [],
            },
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  }

  async getReviewsByParams(params) {
    try {
      return await this.reviewRepository.findAndCountAll({
        limit: +params.quantity,
        offset: +params.offset,
        order: [[params.order, params.direction]],
        attributes: {
          exclude: ['deletedAt'],
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    try {
      return await this.reviewRepository.update(updateReviewDto, {
        where: { id },
      });
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

  async checkIfUserGaveLike(
    userId: number,
    reviewId: number,
    transaction: sequelize.Transaction,
  ) {
    try {
      const like = await this.likeRepository.findOne({
        where: {
          userId,
          reviewId,
        },
        transaction,
      });

      return !!like;
    } catch (error) {
      console.error(error);
    }
  }

  async likeReview(reviewID: number, req: Request): Promise<Review> {
    const transaction = await this.reviewRepository.sequelize.transaction();
    try {
      const hasLiked = await this.checkIfUserGaveLike(
        req['user'].id,
        reviewID,
        transaction,
      );

      if (hasLiked) {
        throw new HttpException(
          {
            message: 'User already set like to this review',
          },
          HttpStatus.FORBIDDEN,
        );
      }

      const setInfoAboutLike = await this.likeRepository.create(
        {
          userId: req['user'].id,
          reviewId: reviewID,
        },
        { transaction },
      );

      if (setInfoAboutLike) {
        const review = await this.reviewRepository.findByPk(reviewID, {
          transaction,
        });
        if (review) {
          review.like++;
          await review.save({ transaction });
        }

        await transaction.commit();

        return review;
      }
    } catch (error) {
      await transaction.rollback();
      console.error(error);
    }
  }

  async findAllByFullTextSearch(query: string): Promise<{
    reviews: Review[];
    comments: Comment[];
  }> {
    try {
      const reviews = await this.reviewRepository
        .scope('fullTextSearch')
        .findAll({
          where: {
            [Op.or]: [
              { title: { [Op.like]: `%${query}%` } },
              { content: { [Op.like]: `%${query}%` } },
            ],
          },
          replacements: {
            query: query,
          },
        });

      const comments = await this.commentRepository
        .scope('fullTextSearch')
        .findAll({
          where: {
            [Op.or]: [
              { commentTitle: { [Op.like]: `%${query}%` } },
              { commentText: { [Op.like]: `%${query}%` } },
            ],
          },
          replacements: {
            query: query,
          },
        });

      return { reviews, comments };
    } catch (error) {
      console.error(error);
    }
  }

  async getPopularTags(limit = 20) {
    const topTags = await this.reviewTagRepository.findAll({
      attributes: ['tagId', [Sequelize.literal('COUNT(tagId)'), 'count']],
      include: [
        {
          model: this.tagRepository,
          attributes: ['name'],
        },
      ],
      group: ['tagId'],
      order: [[Sequelize.literal('count'), 'DESC']],
      limit: limit,
    });

    return topTags.map((tag: any) => ({
      tagId: tag.tagId,
      name: tag.tags.name,
      count: tag.get('count'),
    }));
  }

  async searchTags(query: string) {
    return await this.tagRepository.findAll({
      where: {
        name: {
          [Op.like]: `%${query}%`,
        },
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt'],
      },
    });
  }
}
