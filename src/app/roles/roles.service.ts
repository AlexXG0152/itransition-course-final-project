import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize/dist/common/sequelize.decorators';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

  async create(createRoleDto: CreateRoleDto) {
    try {
      return await this.roleRepository.create(createRoleDto);
    } catch (error) {
      console.error(error.errors.message);
    }
  }

  async findAll() {
    try {
      return await this.roleRepository.findAll();
    } catch (error) {
      console.error(error);
    }
  }

  async findOne(value: string) {
    try {
      return await this.roleRepository.findOne({ where: { value } });
    } catch (error) {
      console.error(error);
    }
  }

  async update(value: string, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${value} role ${updateRoleDto}`;
  }

  async remove(value: string) {
    try {
      return await this.roleRepository.destroy({ where: { value } });
    } catch (error) {
      console.error(error);
    }
  }
}
