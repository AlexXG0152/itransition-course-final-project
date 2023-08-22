import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Value is too short' })
  @MaxLength(50, { message: 'Value is too long' })
  @ApiProperty({ example: 'ADMIN', description: 'User role value' })
  readonly value: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Description is too short' })
  @MaxLength(150, { message: 'Description is too long' })
  @ApiProperty({ example: 'Administrator', description: 'Role description' })
  readonly description: string;
}
