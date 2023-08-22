import { Column, DataType, Table, Model } from 'sequelize-typescript';
import { IUserCreationAttrs } from '../interfaces/userCreation.interface';

@Table({ tableName: 'users' })
export class User extends Model<User, IUserCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

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

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  banned: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  banreason: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  deleted: boolean;
}
