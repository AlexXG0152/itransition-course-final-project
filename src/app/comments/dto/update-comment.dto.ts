import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Comment ID',
    description: 'Comment ID',
  })
  id: number;

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
