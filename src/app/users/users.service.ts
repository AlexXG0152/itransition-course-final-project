import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private roleService: RolesService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const user = await this.userRepository.create(createUserDto);
      const role = await this.roleService.findOne('USER');
      user.$set('roles', [role.id]);
      user.roles = [role];
      return user;
    } catch (error) {
      console.error(error);
    }
  }

  async findAllUsers() {
    try {
      const users = await this.userRepository.findAll({
        include: { all: true },
      });
      return users;
    } catch (error) {
      console.error(error);
    }
  }

  async findOneUser(id: number) {
    try {
      return await this.userRepository.findOne({ where: { id } });
    } catch (error) {
      console.error(error);
    }
  }

  async findOneUserByEmail(email: string) {
    try {
      return await this.userRepository.findOne({
        where: { email },
        include: { all: true },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.update(updateUserDto, {
        where: { id },
      });

      return user;
    } catch (error) {
      console.error(error);
    }
  }

  async removeUser(id: number) {
    try {
      return await this.userRepository.destroy({ where: { id } });
    } catch (error) {
      console.error(error);
    }
  }
}
