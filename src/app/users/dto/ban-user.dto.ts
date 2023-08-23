import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class BanUserDto {
  @IsString()
  @ApiProperty({ example: '1', description: 'User ID' })
  readonly userId: string;

  @IsOptional()
  @IsString()
  @MaxLength(250, { message: 'Ban reason is too long' })
  @ApiProperty({
    example: 'Fake Info',
    description: 'Description why banned 250 symbols',
  })
  readonly banreason: string;
}
