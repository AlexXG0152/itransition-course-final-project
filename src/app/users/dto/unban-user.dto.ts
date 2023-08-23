import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UnbanUserDto {
  @IsString()
  @ApiProperty({ example: '1', description: 'User ID' })
  readonly userId: string;

  @IsOptional()
  @IsString()
  @MaxLength(250, { message: 'Unban reason is too long' })
  @ApiProperty({
    example: 'Fake Info',
    description: 'Description why unbanned 250 symbols',
  })
  readonly unbanreason: string;
}
