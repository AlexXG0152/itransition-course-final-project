import { Column, DataType, Table, Model } from 'sequelize-typescript';
import { IUserCreationAttrs } from '../interfaces/userCreation.interface';
import { ApiProperty } from '@nestjs/swagger';

@Table({ tableName: 'users' })
export class User extends Model<User, IUserCreationAttrs> {
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
    type: DataType.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true,
      len: [5, 100],
    },
  })
  email: string;

  @ApiProperty({
    example: 'User',
    description: 'User name from 0 to 50 symbols',
  })
  @Column({
    type: DataType.STRING,
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
    description: 'Password from 6 to 30 symbols',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true,
      len: [6, 30],
    },
  })
  password: string;

  @ApiProperty({ example: 'false', description: 'User blocked or not' })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  banned: boolean;

  @ApiProperty({ example: 'Fake Info', description: 'Post fake reviews' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  banreason: string;

  @ApiProperty({
    example: 'true',
    description: 'User deleted or not',
  })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  deleted: boolean;
}
