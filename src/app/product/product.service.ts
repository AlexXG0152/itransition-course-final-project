import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import sequelize, { Op } from 'sequelize';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Review } from '../reviews/entities/review.entity';
import { Rating } from './entities/rating.entity';
import { RateProductDto } from './dto/rate-product.dto';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { Subcategory } from './entities/subcategory.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private productRepository: typeof Product,
    @InjectModel(Rating)
    private ratingRepository: typeof Rating,
    @InjectModel(Category)
    private categoryRepository: typeof Category,
    @InjectModel(Subcategory)
    private subcategoryRepository: typeof Subcategory,
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
      return await this.productRepository.findAll({
        include: [Review, Category, Subcategory, Rating],
      });
    } catch (error) {
      console.error(error);
    }
  }

  async findOneByID(id: number) {
    try {
      return await this.productRepository.findByPk(id, {
        include: [Review, Category, Subcategory, Rating],
      });
    } catch (error) {
      console.error(error);
    }
  }
  async findOneByTitle(name: string) {
    try {
      return await this.productRepository.findAll({
        where: { productTitle: { [Op.like]: `%${name}%` } },
      });
    } catch (error) {}
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

  async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      return await this.categoryRepository.create(createCategoryDto);
    } catch (error) {
      console.error(error);
    }
  }

  async createSubcategory(createSubcategoryDto: CreateSubcategoryDto) {
    try {
      return await this.subcategoryRepository.create(createSubcategoryDto);
    } catch (error) {
      console.error(error);
    }
  }

  async findAllCategory() {
    try {
      return await this.categoryRepository.findAll({
        include: [
          {
            model: Subcategory,
            as: 'subcategories',
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
          },
        ],
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt'],
        },
        // raw: true,
        nest: true,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async findAllSubcategory() {
    try {
      return await this.subcategoryRepository.findAll({
        include: [
          {
            model: Category,
            as: 'category',
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
          },
        ],
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt'],
        },
        // raw: true,
        nest: true,
      });
    } catch (error) {
      console.error(error);
    }
  }
}
