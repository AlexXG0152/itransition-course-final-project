import {
  Column,
  Model,
  Table,
  HasMany,
  DataType,
  Index,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Review } from 'src/app/reviews/entities/review.entity';
import { Rating } from './rating.entity';
import { Subcategory } from './subcategory.entity';
import { Category } from './category.entity';

@Table({ tableName: 'products', paranoid: true })
export class Product extends Model<Product> {
  @ApiProperty({ example: '1', description: 'Uniq product ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'Title',
    description: 'Product title from 1 to 255 symbols',
  })
  @Index('product_title_index')
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true,
      len: [1, 255],
    },
  })
  productTitle: string;

  @ApiProperty({
    example: 'Category ID',
    description: 'Category ID',
  })
  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true,
    },
  })
  categoryId: number;

  @BelongsTo(() => Category)
  category: Category;

  @ApiProperty({
    example: 'Subcategory ID',
    description: 'Subcategory ID',
  })
  @ForeignKey(() => Subcategory)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    validate: {
      notNull: false,
      notEmpty: false,
    },
  })
  subcategoryId: number;

  @BelongsTo(() => Subcategory)
  subcategory: Subcategory;

  @ApiProperty({ example: 'Rating', description: 'Product rating from 1 to 5' })
  @Column({
    type: DataType.STRING,
    validate: {
      notNull: false,
      notEmpty: false,
    },
  })
  productRating: string;

  @HasMany(() => Review)
  reviews: Review[];

  @HasMany(() => Rating)
  ratings: Rating[];
}
