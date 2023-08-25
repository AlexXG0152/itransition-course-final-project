import {
  Column,
  Model,
  Table,
  DataType,
  BelongsTo,
  ForeignKey,
  Index,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/app/users/entities/user.entity';
import { Review } from './review.entity';

@Table({ tableName: 'likes', paranoid: true })
export class Like extends Model<Like> {
  @ApiProperty({ example: '1', description: 'Uniq Like ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'userId',
    description: 'userId who give Like',
  })
  @ForeignKey(() => User)
  @Index('userId_index')
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true,
      min: 1,
    },
  })
  userId: number;

  @ApiProperty({
    example: 'reviewId',
    description: 'reviewId for Like',
  })
  @ForeignKey(() => Review)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true,
      min: 1,
    },
  })
  reviewId: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Review)
  review: Review;
}
