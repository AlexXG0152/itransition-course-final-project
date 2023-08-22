import {
  Column,
  DataType,
  Table,
  Model,
  BelongsToMany,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { IRoleCreationAttrs } from '../interfaces/userCreation.interface';
import { User } from 'src/app/users/entities/user.entity';
import { UserRoles } from './user-roles.entity';

@Table({ tableName: 'roles', paranoid: true })
export class Role extends Model<Role, IRoleCreationAttrs> {
  @ApiProperty({ example: '1', description: 'UniqID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'ADMIN', description: 'User role value' })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true,
      len: [1, 50],
    },
  })
  value: string;

  @ApiProperty({ example: 'Administrator', description: 'Role description' })
  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true,
      len: [1, 150],
    },
  })
  description: string;

  @BelongsToMany(() => User, () => UserRoles)
  users: User[];
}
