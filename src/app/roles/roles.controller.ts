import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { ApiOperation } from '@nestjs/swagger/dist/decorators/api-operation.decorator';
import { ApiResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { Role } from './entities/role.entity';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ summary: 'Create ROLE' })
  @ApiResponse({ status: 201, type: Role })
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @ApiOperation({ summary: 'Get all ROLES' })
  @ApiResponse({ status: 201, type: Role })
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @ApiOperation({ summary: 'Get ROLE by value' })
  @ApiResponse({ status: 201, type: Role })
  @Get(':value')
  findOne(@Param('value') value: string) {
    return this.rolesService.findOne(value);
  }

  @ApiOperation({ summary: 'Update ROLE' })
  @ApiResponse({ status: 201, type: Role })
  @Patch(':value')
  update(@Param('value') value: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(value, updateRoleDto);
  }

  @ApiOperation({ summary: 'Delete ROLE' })
  @ApiResponse({ status: 201, type: Role })
  @Delete(':value')
  remove(@Param('value') value: string) {
    return this.rolesService.remove(value);
  }
}
