import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from './entities/review.entity';
import { Product } from '../product/entities/product.entity';
import { Like } from './entities/like.entity';
import sequelize from 'sequelize';
import { Comment } from '../comments/entities/comment.entity';
import { Category } from '../product/entities/category.entity';
import { Subcategory } from '../product/entities/subcategory.entity';
import { Tag } from './entities/tag.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Product) private productRepository: typeof Product,
    @InjectModel(Review) private reviewRepository: typeof Review,
    @InjectModel(Like) private likeRepository: typeof Like,
    @InjectModel(Tag) private tagRepository: typeof Tag,
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
}
