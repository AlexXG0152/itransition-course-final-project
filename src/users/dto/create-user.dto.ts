import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @MinLength(5, {
    message: 'Email is too short',
  })
  @MaxLength(100, {
    message: 'Email is too long',
  })
  @ApiProperty({
    example: 'mail@mail.com',
    description: 'Email from 5 to 100 symbols',
  })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, {
    message: 'Password is too short',
  })
  @MaxLength(30, {
    message: 'Password is too long',
  })
  @ApiProperty({
    example: 'password',
    description: 'Password from 6 to 30 symbols',
  })
  readonly password: string;
}
