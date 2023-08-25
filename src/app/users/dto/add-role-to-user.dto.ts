import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AddRoleToUserDto {
  @IsNumber()
  @ApiProperty({ example: '1', description: 'User ID' })
  readonly userId: number;

  @IsString()
  @ApiProperty({ example: 'ADMIN', description: 'User Role' })
  readonly value: string;
}
