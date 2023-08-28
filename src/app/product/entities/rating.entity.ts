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
import { Product } from './product.entity';

@Table({ tableName: 'ratings', paranoid: true })
export class Rating extends Model<Rating> {
  @ApiProperty({ example: '1', description: 'Uniq rating ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'userId', description: 'userId who give rating' })
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

  @ApiProperty({ example: 'productId', description: 'productId for rating' })
  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true,
      min: 1,
    },
  })
  productId: number;

  @ApiProperty({ example: 'productId rate', description: 'productId rate' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true,
    },
  })
  rate: string;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Product)
  product: Product;
}
