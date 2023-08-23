import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { RolesService } from '../roles/roles.service';
import { AddRoleToUserDto } from './dto/add-role-to-user.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { UnbanUserDto } from './dto/unban-user.dto';

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

  async addRoleToUser(addRoleToUserDto: AddRoleToUserDto) {
    try {
      const user = await this.userRepository.findByPk(addRoleToUserDto.userId);
      const role = this.roleService.findOne(addRoleToUserDto.value);

      if (user && role) {
        await user.$add('role', (await role).id);
        return addRoleToUserDto;
      }

      throw new HttpException("User didn't found", HttpStatus.NOT_FOUND);
    } catch (error) {
      console.error(error);
    }
  }

  async banUser(banUserDto: BanUserDto) {
    try {
      const user = await this.userRepository.findByPk(banUserDto.userId);
      if (!user) {
        throw new HttpException("User didn't found", HttpStatus.NOT_FOUND);
      }
      user.banned = true;
      user.banreason = banUserDto.banreason;

      await user.save();

      return user;
    } catch (error) {
      console.error(error);
    }
  }

  async unbanUser(unbanUserDto: UnbanUserDto) {
    try {
      const user = await this.userRepository.findByPk(unbanUserDto.userId);
      if (!user) {
        throw new HttpException("User didn't found", HttpStatus.NOT_FOUND);
      }
      user.banned = false;
      user.unbanreason = `Unbanned: ${unbanUserDto.unbanreason}`;

      await user.save();

      return user;
    } catch (error) {
      console.error(error);
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    try {
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      return await this.userRepository.update(updateUserDto, {
        where: { id },
      });
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
