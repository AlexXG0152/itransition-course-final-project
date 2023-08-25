import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsString()
  @IsOptional()
  @MinLength(1, { message: 'Product title is too short' })
  @MaxLength(255, { message: 'Product title is too long' })
  @ApiProperty({
    example: 'Product title',
    description: 'Product title from 1 to 255 symbols',
  })
  productTitle: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Product rating',
    description: 'Product rating from 1 to 5',
  })
  productRating: string;
}
