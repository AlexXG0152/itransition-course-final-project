import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Product Category is too short' })
  @MaxLength(255, { message: 'Product Category is too long' })
  @ApiProperty({
    example: 'Product Category',
    description: 'Product Category from 1 to 255',
  })
  name: string;
}
