import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SocialUserDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @MinLength(5, { message: 'Email is too short' })
  @MaxLength(100, { message: 'Email is too long' })
  @ApiProperty({
    example: 'mail@mail.com',
    description: 'Email from 5 to 100 symbols',
  })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Username is too short' })
  @MaxLength(100, { message: 'Username is too long' })
  @ApiProperty({
    example: 'Username',
    description: 'Username from 1 to 100 symbols',
  })
  readonly username: string;

  @IsString()
  @IsOptional()
  @MaxLength(250, { message: 'Picture link is too long' })
  @ApiProperty({
    example: 'Picture link',
    description: 'Picture link from up to 250 symbols',
  })
  readonly picture: string;

  @IsString()
  @IsOptional()
  @MaxLength(250, { message: 'accessToken is too long' })
  @ApiProperty({
    example: 'accessToken',
    description: 'accessToken from up to 250 symbols',
  })
  readonly accessToken: string;
}
