import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddRoleToUserDto {
  @IsString()
  @ApiProperty({ example: '1', description: 'User ID' })
  readonly userId: string;

  @IsString()
  @ApiProperty({ example: 'ADMIN', description: 'User Role' })
  readonly value: string;
}
