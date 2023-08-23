import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review) private reviewRepository: typeof Review) {}
  async create(createReviewDto: CreateReviewDto) {
    try {
      const review = await this.reviewRepository.create(createReviewDto);
      return review;
    } catch (error) {
      console.error(error);
    }
  }

  async findAll() {
    try {
    } catch (error) {
      console.error(error);
    }
  }

  async findOne(id: number) {
    try {
      return `This action returns a #${id} review`;
    } catch (error) {
      console.error(error);
    }
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    try {
      return `This action updates a #${id} ${updateReviewDto}review`;
    } catch (error) {
      console.error(error);
    }
  }

  async remove(id: number) {
    try {
      return `This action removes a #${id} review`;
    } catch (error) {
      console.error(error);
    }
  }
}
