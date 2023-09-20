import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { Subcategory } from './entities/subcategory.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category)
    private categoryRepository: typeof Category,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      return await this.categoryRepository.create(createCategoryDto);
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
        nest: true,
      });
    } catch (error) {
      console.error(error);
    }
  }
}
