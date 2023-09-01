import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'Review title is too short' })
  @ApiProperty({
    example: 'Review title',
    description: 'Review title from 1 symbol',
  })
  readonly title: string;

  // @IsString()
  // @IsNotEmpty()
  // @MinLength(5, { message: 'Review work category name is too short' })
  // @MaxLength(100, { message: 'Review work category name is too long' })
  // @ApiProperty({
  //   example: 'Review work category name',
  //   description: 'Review work category name from 1 to 100 symbols',
  // })
  // readonly category: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'Review work tags is too short' })
  @MaxLength(100, { message: 'Review work tags is too long' })
  @ApiProperty({
    example: 'Review work tags',
    description: 'Review work tags from 1 to 200 symbols',
  })
  readonly tags: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'Review content is too short' })
  @MaxLength(100, { message: 'Review content is too long' })
  @ApiProperty({
    example: 'Review content',
    description: 'Review content from 1 to 16777215 symbols',
  })
  readonly content: string;

  @IsString()
  @IsOptional()
  @MinLength(0, { message: 'Review images links (optional) is too short' })
  @MaxLength(255, { message: 'Review images links (optional) is too long' })
  @ApiProperty({
    example: 'Review images links (optional)',
    description: 'Review images links (optional) from 0 to 20 images',
  })
  readonly imageslinks?: string;

  @IsString()
  @IsNotEmpty()
  @Min(0, { message: 'Review author rating mark is too low' })
  @Max(10, { message: 'Review author rating mark is too hight' })
  @ApiProperty({
    example: 'Review author rating mark',
    description: 'Review author rating mark from 0 to 10',
  })
  readonly reviewRating: number;

  //   @IsNumber()
  //   @IsNotEmpty()
  //   @Min(5, { message: 'Review author ID is too short' })
  //   @Max(100, { message: 'Review author ID is too long' })
  //   @ApiProperty({
  //     example: 'Review author ID',
  //     description: 'Review author ID',
  //   })
  //   readonly userId: number;

  @IsString()
  @MinLength(1, { message: 'Product Name is too short' })
  @MaxLength(255, { message: 'Product Name is too long' })
  @ApiProperty({
    example: 'Product Name',
    description: 'Product Name text',
  })
  readonly productTitle: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1, { message: 'Review product ID is too short' })
  @Max(100, { message: 'Review product ID is too long' })
  @ApiProperty({
    example: 'Review product ID',
    description: 'Review product ID',
  })
  readonly productId: number;
}
