import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UnRateProductDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 'productId',
    description: 'productId',
  })
  productId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 'rateID',
    description: 'rateID',
  })
  userId: number;
}
