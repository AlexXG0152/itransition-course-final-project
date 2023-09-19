import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import sequelize from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from './entities/review.entity';
import { Like } from './entities/like.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Review) private reviewRepository: typeof Review,
    @InjectModel(Like) private likeRepository: typeof Like,
    @InjectModel(User) private userRepository: typeof User,
  ) {}

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
        const user = await this.userRepository.findByPk(req['user'].id);
        if (user) {
          user.receivedLikes++;
          await user.save({ transaction });
        }

        await transaction.commit();

        return review;
      }
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
