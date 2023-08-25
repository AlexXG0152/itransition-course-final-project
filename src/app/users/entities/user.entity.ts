import {
  Column,
  DataType,
  Table,
  Model,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { IUserCreateAttrs } from '../interfaces/userCreate.interface';
import { Role } from 'src/app/roles/entities/role.entity';
import { UserRoles } from 'src/app/roles/entities/user-roles.entity';
import { Review } from 'src/app/reviews/entities/review.entity';
import { Rating } from 'src/app/product/entities/rating.entity';

@Table({ tableName: 'users', paranoid: true })
export class User extends Model<User, IUserCreateAttrs> {
  @ApiProperty({ example: '1', description: 'UniqID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'mail@mail.com',
    description: 'Email from 5 to 100 symbols',
  })
  @Column({
    type: DataType.STRING(100),
    unique: true,
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true,
      len: [5, 100],
      isEmail: true,
    },
  })
  email: string;

  @ApiProperty({
    example: 'User',
    description: 'User name from 0 to 50 symbols',
  })
  @Column({
    type: DataType.STRING(50),
    unique: false,
    allowNull: true,
    validate: {
      notNull: false,
      notEmpty: false,
      len: [0, 50],
    },
  })
  name: string;

  @ApiProperty({
    example: 'password',
    description: 'Password from 6 to 60 symbols',
  })
  @Column({
    type: DataType.STRING(60),
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true,
      len: [6, 60],
    },
  })
  password: string;

  @ApiProperty({ example: 'false', description: 'User blocked or not' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  banned: boolean;

  @ApiProperty({ example: 'Fake Info', description: 'Post fake reviews' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: {
      notNull: false,
      notEmpty: false,
      len: [1, 250],
    },
  })
  banreason: string;

  @ApiProperty({
    example: 'Apologize',
    description: 'Apologized for fake reviews',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: {
      notNull: false,
      notEmpty: false,
      len: [1, 250],
    },
  })
  unbanreason: string;

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];

  @HasMany(() => Review)
  reviews: Review[];

  @HasMany(() => Rating)
  ratings: Rating[];
}
