import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Comment Title is too short' })
  @MaxLength(255, { message: 'Comment Title is too long' })
  @ApiProperty({
    example: 'Comment title',
    description: 'Comment title from 1 to 255',
  })
  commentTitle: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Comment text is too short' })
  @ApiProperty({
    example: 'Comment text',
    description: 'Comment text (min 1 symbol)',
  })
  commentText: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 'User Id',
    description: 'User Id',
  })
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Review Id',
    description: 'Review Id',
  })
  reviewId: number;
}
