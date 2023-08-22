import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.userRepository.create(createUserDto);
    return user;
  }

  async findAllUsers() {
    const users = await this.userRepository.findAll();
    return users;
  }

  async findOneUser(id: number) {
    return `This action returns a #${id} user`;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async removeUser(id: number) {
    return `This action removes a #${id} user`;
  }
}
