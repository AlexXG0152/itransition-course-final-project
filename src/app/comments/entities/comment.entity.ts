import {
  Column,
  Model,
  Table,
  DataType,
  Index,
  BelongsTo,
  ForeignKey,
  Scopes,
  Sequelize,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Review } from 'src/app/reviews/entities/review.entity';
import { User } from 'src/app/users/entities/user.entity';

@Scopes(() => ({
  fullTextSearch: {
    where: Sequelize.literal(
      'MATCH(commentTitle, commentText) AGAINST(:query)',
    ),
  },
}))
@Table({ tableName: 'comments', paranoid: true })
export class Comment extends Model<Comment> {
  @ApiProperty({ example: '1', description: 'Uniq comment ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'Comment Title',
    description: 'Comment title from 1 to 255 symbols',
  })
  @Index({ type: 'FULLTEXT', name: 'title_content' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true,
      len: [1, 255],
    },
  })
  commentTitle: string;

  @ApiProperty({ example: 'Comment Text', description: 'Comment text' })
  @Index({ type: 'FULLTEXT', name: 'title_content' })
  @Column({
    type: DataType.TEXT,
    validate: {
      notNull: false,
      notEmpty: false,
    },
  })
  commentText: string;

  @ApiProperty({ example: 'false', description: 'Comment Text edited or not' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  edited: boolean;

  @ApiProperty({
    example: 'Comment author ID',
    description: 'Comment author ID',
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

  @BelongsTo(() => User)
  user: User;

  @ApiProperty({ example: 'Review author ID', description: 'Review author ID' })
  @ForeignKey(() => Review)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true,
    },
  })
  reviewId: number;

  @BelongsTo(() => Review)
  review: Review;
}
