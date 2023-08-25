import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Product title',
    description: 'Product title from 1 to 5',
  })
  id: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Product Title is too short' })
  @MaxLength(255, { message: 'Product Title is too long' })
  @ApiProperty({
    example: 'Product title',
    description: 'Product title from 1 to 255',
  })
  productTitle: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Product rating',
    description: 'Product rating from 1 to 5',
  })
  productRating?: string;
}
