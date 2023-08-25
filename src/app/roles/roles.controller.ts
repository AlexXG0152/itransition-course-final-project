import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger/dist/decorators/api-operation.decorator';
import { ApiResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles-auth.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ summary: 'Create ROLE' })
  @ApiResponse({ status: 201, type: Role })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @ApiOperation({ summary: 'Get all ROLES' })
  @ApiResponse({ status: 200, type: Role })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @ApiOperation({ summary: 'Get ROLE by value' })
  @ApiResponse({ status: 200, type: Role })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Get(':value')
  findOne(@Param('value') value: string) {
    return this.rolesService.findOne(value);
  }

  @ApiOperation({ summary: 'Update ROLE' })
  @ApiResponse({ status: 200, type: Role })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Patch(':value')
  update(@Param('value') value: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(value, updateRoleDto);
  }

  @ApiOperation({ summary: 'Delete ROLE' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Delete(':value')
  remove(@Param('value') value: string) {
    return this.rolesService.remove(value);
  }
}
