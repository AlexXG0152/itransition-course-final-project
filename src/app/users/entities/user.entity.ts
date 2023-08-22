import {
  Column,
  DataType,
  Table,
  Model,
  BelongsToMany,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { IUserCreateAttrs } from '../interfaces/userCreate.interface';
import { Role } from 'src/app/roles/entities/role.entity';
import { UserRoles } from 'src/app/roles/entities/user-roles.entity';

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
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  banned: boolean;

  @ApiProperty({ example: 'Fake Info', description: 'Post fake reviews' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: {
      notNull: false,
      notEmpty: false,
      len: [1, 150],
    },
  })
  banreason: string;

  @ApiProperty({
    example: 'true',
    description: 'User deleted or not',
  })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  deleted: boolean;

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];
}
