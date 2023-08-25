// import { Column, Model, Table, HasMany, DataType } from 'sequelize-typescript';
// import { Review } from './review.entity';
// import { ApiProperty } from '@nestjs/swagger';

// @Table({ tableName: 'products_reviews', paranoid: true })
// export class ProductReview extends Model<ProductReview> {
//   @ApiProperty({ example: '1', description: 'Uniq product ID' })
//   @Column({
//     type: DataType.INTEGER,
//     unique: true,
//     autoIncrement: true,
//     primaryKey: true,
//   })
//   id: number;

//   @ApiProperty({
//     example: 'Title',
//     description: 'Product title from 1 to 200 symbols',
//   })
//   @Column({
//     type: DataType.STRING(200),
//     allowNull: false,
//     validate: {
//       notNull: true,
//       notEmpty: true,
//       len: [1, 200],
//     },
//   })
//   title: string;

//   @ApiProperty({
//     example: 'Rating',
//     description: 'Product rating from 1 to 5',
//   })
//   @Column({
//     type: DataType.INTEGER,
//     validate: {
//       notNull: false,
//       notEmpty: false,
//       min: 1,
//       max: 5,
//     },
//   })
//   rating: number;

//   @HasMany(() => Review)
//   reviews: Review[];
// }
