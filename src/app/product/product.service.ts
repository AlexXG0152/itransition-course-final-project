import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './entities/product.entity';
import { Review } from '../reviews/entities/review.entity';
import { Rating } from './entities/rating.entity';
import { RateProductDto } from './dto/rate-product.dto';
import sequelize from 'sequelize';
import { IProductDBAnswer } from './interfaces/IProductDBAnswer.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private productRepository: typeof Product,
    @InjectModel(Rating)
    private ratingRepository: typeof Rating,
  ) {}

  async create(createProductDto: CreateProductDto) {
    // const candidate = await this.productRepository.findByPk(
    //   createProductDto.id,
    // );
    // if (candidate) {
    //   return;
    // }
    try {
      return await this.productRepository.create(createProductDto);
    } catch (error) {
      console.error(error);
    }
  }

  async findAll() {
    try {
      return await this.productRepository.findAll({ include: [Review] });
    } catch (error) {
      console.error(error);
    }
  }

  async findOne(id: number) {
    try {
      return await this.productRepository.findByPk(id, { include: [Review] });
    } catch (error) {
      console.error(error);
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      return await this.productRepository.update(updateProductDto, {
        where: { id },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async remove(id: number) {
    try {
      return await this.productRepository.destroy({ where: { id } });
    } catch (error) {
      console.error(error);
    }
  }

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
        const product: IProductDBAnswer = await this.productRepository.findOne({
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
          // group: ['Product.id'],
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
      console.error(error);
    }
  }
}
