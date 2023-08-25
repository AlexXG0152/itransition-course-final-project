import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class UnbanUserDto {
  @IsNumber()
  @ApiProperty({ example: '1', description: 'User ID' })
  readonly userId: number;

  @IsOptional()
  @IsString()
  @MaxLength(250, { message: 'Unban reason is too long' })
  @ApiProperty({
    example: 'Fake Info',
    description: 'Description why unbanned 250 symbols',
  })
  readonly unbanreason: string;
}
