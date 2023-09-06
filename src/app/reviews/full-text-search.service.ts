import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from './entities/review.entity';
import { Comment } from '../comments/entities/comment.entity';

@Injectable()
export class FullTextSearchService {
  constructor(
    @InjectModel(Review) private reviewRepository: typeof Review,
    @InjectModel(Comment) private commentRepository: typeof Comment,
  ) {}

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
}
