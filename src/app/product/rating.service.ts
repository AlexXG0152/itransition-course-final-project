import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import sequelize from 'sequelize';
import { Product } from './entities/product.entity';
import { Rating } from './entities/rating.entity';
import { RateProductDto } from './dto/rate-product.dto';
import { UnRateProductDto } from './dto/unrate-product.dto';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Product)
    private productRepository: typeof Product,
    @InjectModel(Rating)
    private ratingRepository: typeof Rating,
  ) {}

  async checkIfUserGaveRating(
    userId: number,
    productId: number,
    transaction: sequelize.Transaction,
  ) {
    try {
      const rating = await this.ratingRepository.findOne({
        where: {
          userId,
          productId,
        },
        transaction,
      });

      return !!rating;
    } catch (error) {
      console.error(error);
    }
  }

  async rateProduct(req: Request, rateProductDto: RateProductDto) {
    const transaction = await this.productRepository.sequelize.transaction();
    try {
      const hasRated = await this.checkIfUserGaveRating(
        req['user'].id,
        rateProductDto.productId,
        transaction,
      );

      if (hasRated) {
        throw new HttpException(
          {
            message: 'User already set rating to this product',
          },
          HttpStatus.FORBIDDEN,
        );
      }

      const setRating = await this.ratingRepository.create(
        {
          ...rateProductDto,
          userId: req['user'].id,
        },
        { transaction },
      );

      if (setRating) {
        const product: any = await this.productRepository.findOne({
          where: { id: rateProductDto.productId },
          include: [
            {
              model: Rating,
              as: 'ratings',
              attributes: [],
            },
          ],
          attributes: {
            include: [
              [sequelize.fn('AVG', sequelize.col('ratings.rate')), 'avgRating'],
            ],
          },
          transaction,
        });

        const avgRating = product.dataValues.avgRating;
        if (avgRating) {
          await this.productRepository.update(
            { productRating: avgRating },
            { where: { id: rateProductDto.productId }, transaction },
          );
        }
        await transaction.commit();
        return product;
      }
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async unrateProduct(req: Request, unRateProductDto: UnRateProductDto) {
    const transaction = await this.productRepository.sequelize.transaction();
    try {
      const rating = await this.ratingRepository.findOne({
        where: {
          userId: unRateProductDto.userId,
          productId: unRateProductDto.productId,
        },
        transaction,
      });

      if (!rating) {
        throw new HttpException(
          {
            message: "User didn't set rating to this product",
          },
          HttpStatus.FORBIDDEN,
        );
      }

      const deleteRating = await this.ratingRepository.destroy({
        where: { id: rating.id },
        transaction,
      });

      if (deleteRating) {
        const product: any = await this.productRepository.findOne({
          where: { id: unRateProductDto.productId },
          include: [
            {
              model: Rating,
              as: 'ratings',
              attributes: [],
            },
          ],
          attributes: {
            include: [
              [sequelize.fn('AVG', sequelize.col('ratings.rate')), 'avgRating'],
            ],
          },
          transaction,
        });

        await this.productRepository.update(
          { productRating: product.dataValues.avgRating },
          {
            where: { id: unRateProductDto.productId },
            transaction,
          },
        );

        await product.save();
      }

      await transaction.commit();

      const product2: any = await this.productRepository.findOne({
        where: { id: unRateProductDto.productId },
      });

      return product2;
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
