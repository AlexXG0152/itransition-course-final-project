import {
  Column,
  Model,
  Table,
  DataType,
  BelongsToMany,
  Index,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { ReviewTag } from './review-tag.entity';
import { Review } from './review.entity';

@Table({ tableName: 'tags', paranoid: true })
export class Tag extends Model<Tag> {
  @ApiProperty({ example: '1', description: 'Uniq Tag ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Tag name', description: 'Tag name' })
  @Index('tag_index')
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true,
      len: [1, 255],
    },
  })
  name: string;

  @BelongsToMany(() => Review, () => ReviewTag)
  reviews: Review[];
}
