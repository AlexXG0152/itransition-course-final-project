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
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, {
    message: 'Password is too short',
  })
  @MaxLength(30, {
    message: 'Password is too long',
  })
  readonly password: string;
}
