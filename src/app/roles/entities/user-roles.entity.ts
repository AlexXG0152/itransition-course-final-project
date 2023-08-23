import {
  Column,
  DataType,
  Table,
  Model,
  ForeignKey,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from './role.entity';
import { User } from 'src/app/users/entities/user.entity';

@Table({ tableName: 'user_roles', paranoid: true })
export class UserRoles extends Model<UserRoles> {
  @ApiProperty({ example: '1', description: 'UniqID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: '1', description: 'RoleID value' })
  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER })
  roleId: number;

  @ApiProperty({ example: '22', description: 'UserID value' })
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;
}
