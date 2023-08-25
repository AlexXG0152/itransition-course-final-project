import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class RateProductDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 'productId',
    description: 'productId',
  })
  productId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Product title',
    description: 'Product title from 1 to 5',
  })
  rate: string;
}
