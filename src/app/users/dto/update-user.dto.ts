import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsEmail()
  @IsOptional()
  @IsString()
  @MinLength(5, { message: 'Email is too short' })
  @MaxLength(100, { message: 'Email is too long' })
  @ApiProperty({
    example: 'mail@mail.com',
    description: 'Email from 5 to 100 symbols',
  })
  readonly email: string;

  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Name is too short' })
  @MaxLength(50, { message: 'Name is too long' })
  @ApiProperty({
    example: 'User',
    description: 'User name from 1 to 50 symbols',
  })
  readonly name: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password is too short' })
  @MaxLength(30, { message: 'Password is too long' })
  @ApiProperty({
    example: 'password',
    description: 'Password from 6 to 30 symbols',
  })
  password: string;
}
