import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateSubcategoryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Product Subcategory  is too short' })
  @MaxLength(255, { message: 'Product Subcategory  is too long' })
  @ApiProperty({
    example: 'Product Subcategory ',
    description: 'Product Subcategory  from 1 to 255',
  })
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Product Subcategory ID',
    description: 'Product Subcategory ID',
  })
  categoryId: number;
}
