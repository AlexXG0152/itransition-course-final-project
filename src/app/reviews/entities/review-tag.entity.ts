import {
  Table,
  ForeignKey,
  Column,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import { Review } from './review.entity';
import { Tag } from './tag.entity';
import { Model } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

@Table({ tableName: 'review_tag', paranoid: true })
export class ReviewTag extends Model<ReviewTag> {
  @ApiProperty({ example: 'reviewId', description: 'reviewId' })
  @ForeignKey(() => Review)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    validate: {
      notNull: false,
      notEmpty: false,
    },
  })
  reviewId: number;

  @ApiProperty({ example: 'tagId', description: 'tagId' })
  @ForeignKey(() => Tag)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    validate: {
      notNull: false,
      notEmpty: false,
    },
  })
  tagId: number;

  @BelongsTo(() => Tag)
  tags: Tag[];
}
