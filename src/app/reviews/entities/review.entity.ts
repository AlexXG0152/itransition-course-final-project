import {
  Column,
  DataType,
  Table,
  Model,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { IReviewCreateAttrs } from '../interfaces/reviewCreate.interface';
import { User } from 'src/app/users/entities/user.entity';
import { ProductReview } from './product.entity';

@Table({ tableName: 'reviews', paranoid: true })
export class Review extends Model<Review, IReviewCreateAttrs> {
  @ApiProperty({ example: '1', description: 'Uniq review ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'Review title',
    description: 'Review title from 1 to 100 symbols',
  })
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true,
      len: [1, 100],
    },
  })
  title: string;

  @ApiProperty({
    example: 'Review work category name',
    description: 'Review work category name from 1 to 100 symbols',
  })
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true,
      len: [1, 100],
    },
  })
  category: string;

  @ApiProperty({
    example: 'Review work tags',
    description: 'Review work tags from 1 to 200 symbols',
  })
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true,
      len: [1, 200],
    },
  })
  tags: string;

  @ApiProperty({
    example: 'Review text',
    description: 'Review text from 1 to 200 symbols',
  })
  @Column({
    type: DataType.TEXT('medium'),
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true,
      len: [1, 16777215],
    },
  })
  text: string;

  @ApiProperty({
    example: 'Review images links (optional)',
    description: 'Review images links (optional) from 0 to 20 images',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: {
      notNull: false,
      notEmpty: false,
      len: [1, 255],
    },
  })
  imageslinks: string;

  @ApiProperty({
    example: 'Review author rating mark',
    description: 'Review author rating mark from 0 to 10',
  })
  @Column({
    type: DataType.TINYINT,
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true,
      isInt: true,
      min: 0,
      max: 10,
    },
  })
  rating: number;

  @ApiProperty({
    example: 'Review author ID',
    description: 'Review author ID',
  })
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true,
    },
  })
  userId: number;

  @ApiProperty({
    example: 'Review product ID',
    description: 'Review product ID',
  })
  @ForeignKey(() => ProductReview)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true,
    },
  })
  productId: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => ProductReview)
  product: ProductReview;
}
