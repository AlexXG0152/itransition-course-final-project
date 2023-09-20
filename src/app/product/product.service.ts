import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Review } from '../reviews/entities/review.entity';
import { Rating } from './entities/rating.entity';
import { Category } from './entities/category.entity';
import { Subcategory } from './entities/subcategory.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private productRepository: typeof Product,
  ) {}

  async create(createProductDto: CreateProductDto) {
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
}
