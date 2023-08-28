import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Subcategory } from './subcategory.entity';
import { ApiProperty } from '@nestjs/swagger';

@Table({ tableName: 'categories', paranoid: true })
export class Category extends Model<Category> {
  @ApiProperty({ example: '1', description: 'Uniq category ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: '1', description: 'Category Name' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true,
    },
  })
  name: string;

  @HasMany(() => Subcategory)
  subcategories: Subcategory[];
}
