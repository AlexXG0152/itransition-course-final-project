import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Tag } from './entities/tag.entity';
import { ReviewTag } from './entities/review-tag.entity';
import { Sequelize } from 'sequelize-typescript';
import { Review } from './entities/review.entity';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag) private tagRepository: typeof Tag,
    @InjectModel(ReviewTag) private reviewTagRepository: typeof ReviewTag,
    @InjectModel(Review) private reviewRepository: typeof Review,
  ) {}

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

  async getReviewsByTag(params) {
    return await this.reviewRepository.findAndCountAll({
      limit: +params.quantity,
      offset: +params.offset,
      order: [[params.order, params.direction]],
      attributes: {
        exclude: ['deletedAt'],
      },
      include: [
        {
          model: Tag,
          where: { id: params.tagId },
          through: {
            attributes: [],
          },
        },
        {
          model: Product,
          as: 'product',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt'],
          },
        },
      ],
    });
  }
}
