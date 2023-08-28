import {
  Column,
  DataType,
  Table,
  Model,
  BelongsTo,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { IReviewCreateAttrs } from '../interfaces/reviewCreate.interface';
import { User } from 'src/app/users/entities/user.entity';
import { Product } from 'src/app/product/entities/product.entity';
import { Comment } from 'src/app/comments/entities/comment.entity';

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
    example: 'Review content',
    description: 'Review content from 1 to 200 symbols',
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
  content: string;

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
      min: 0,
      max: 10,
    },
  })
  reviewRating: number;

  @ApiProperty({ example: 'Review likes', description: 'Review likes count' })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    validate: {
      notNull: false,
      notEmpty: false,
      isInt: true,
      min: 0,
    },
  })
  like: number;

  @ApiProperty({ example: 'Review author ID', description: 'Review author ID' })
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
  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    validate: {
      notNull: false,
      notEmpty: false,
    },
  })
  productId: number;

  @ApiProperty({
    example: 'Review product name',
    description: 'Review product name',
  })
  @ForeignKey(() => Product)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true,
    },
  })
  productTitle: string;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Product)
  product: Product;

  @HasMany(() => Comment)
  comments: Comment[];
}
