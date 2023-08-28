import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Category } from './category.entity';
import { ApiProperty } from '@nestjs/swagger';

@Table({ tableName: 'subcategories', paranoid: true })
export class Subcategory extends Model<Subcategory> {
  @ApiProperty({ example: '1', description: 'Uniq subcategory ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: '1', description: 'Subcategory ID' })
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

  @ApiProperty({ example: '1', description: 'Subcategory Name' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: {
      notNull: false,
      notEmpty: false,
    },
  })
  name: string;

  @BelongsTo(() => Category)
  category: Category;
}
