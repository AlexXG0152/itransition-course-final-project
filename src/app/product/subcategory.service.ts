import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { Category } from './entities/category.entity';
import { Subcategory } from './entities/subcategory.entity';

@Injectable()
export class SubcategoryService {
  constructor(
    @InjectModel(Subcategory)
    private subcategoryRepository: typeof Subcategory,
  ) {}

  async createSubcategory(createSubcategoryDto: CreateSubcategoryDto) {
    try {
      return await this.subcategoryRepository.create(createSubcategoryDto);
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
        nest: true,
      });
    } catch (error) {
      console.error(error);
    }
  }
}
