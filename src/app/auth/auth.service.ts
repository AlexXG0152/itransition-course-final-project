import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.userService.findOneByEmail(userDto.email);
    if (candidate) {
      throw new HttpException(
        'User with this email already registered',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword = await bcrypt.hash(userDto.password, 10);

    const user = await this.userService.create({
      ...userDto,
      password: hashPassword,
    });

    return this.generateToken(user);
  }

  private async generateToken(user: User) {
    try {
      const payload = { email: user.email, id: user.id, roles: user.roles };
      return {
        token: this.jwtService.sign(payload),
      };
    } catch (error) {
      console.error(error);
    }
  }

  private async validateUser(userDto: CreateUserDto) {
    try {
      const user = await this.userService.findOneByEmail(userDto.email);
      const passwordEquals = await bcrypt.compare(
        userDto.password,
        user.password,
      );

      if (user && passwordEquals) {
        return user;
      }
    } catch (error) {
      throw new UnauthorizedException({ message: 'Bad email or password' });
    }
  }
}
