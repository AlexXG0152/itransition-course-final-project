import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from './entities/review.entity';
import { Comment } from '../comments/entities/comment.entity';
import { IReviewSearchResult } from './interfaces/reviewSearchResult.interface';
import { ICommentSearchResult } from './interfaces/commentSearchResult.interface';

@Injectable()
export class FullTextSearchService {
  constructor(
    @InjectModel(Review) private reviewRepository: typeof Review,
    @InjectModel(Comment) private commentRepository: typeof Comment,
  ) {}

  async findAllByFullTextSearch(
    query: string,
  ): Promise<(IReviewSearchResult | ICommentSearchResult)[]> {
    try {
      const [reviews, comments] = await Promise.all([
        this.reviewRepository.scope('fullTextSearch').findAll({
          where: {
            [Op.or]: [
              { title: { [Op.like]: `%${query}%` } },
              { content: { [Op.like]: `%${query}%` } },
            ],
          },
          replacements: {
            query: query,
          },
        }),
        this.commentRepository.scope('fullTextSearch').findAll({
          where: {
            [Op.or]: [
              { commentTitle: { [Op.like]: `%${query}%` } },
              { commentText: { [Op.like]: `%${query}%` } },
            ],
          },
          replacements: {
            query: query,
          },
          include: [Review],
        }),
      ]);

      const result = [
        ...reviews.map((review) => ({
          reviewId: review.id,
          title: review.title,
          content: review.content,
          from: 'review',
        })),
        ...comments.map((comment) => ({
          commentTitle: comment.commentTitle,
          commentText: comment.commentText,
          reviewId: comment.reviewId,
          title: comment.review.title,
          from: 'comments',
        })),
      ];

      return result;
    } catch (error) {
      console.error(error);
    }
  }
}
