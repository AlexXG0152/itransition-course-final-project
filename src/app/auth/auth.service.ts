import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { SocialUserDto } from './dto/social-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(loginUserDto);
    return this.generateToken(user);
  }

  async registration(createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findOneByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new HttpException(
        'User with this email already registered',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = {
      ...createUserDto,
      password: hashPassword,
    };

    const user = await this.userService.create(newUser);

    return this.generateToken(user);
  }

  private async generateToken(user: User) {
    try {
      const payload = {
        email: user.email,
        id: user.id,
        name: user.name,
        roles: user.roles,
      };
      return {
        name: user.name,
        token: this.jwtService.sign(payload),
      };
    } catch (error) {
      console.error(error);
    }
  }

  private async validateUser(loginUserDto: LoginUserDto) {
    try {
      const user = await this.userService.findOneByEmail(loginUserDto.email);
      if (!user) {
        throw new UnauthorizedException({ message: 'Bad email or password' });
      }

      const passwordEquals = await bcrypt.compare(
        loginUserDto.password,
        user.password,
      );

      if (!passwordEquals) {
        throw new UnauthorizedException({ message: 'Bad email or password' });
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException({ message: 'Bad email or password' });
    }
  }

  private async findOrCreateUser(socialUserDto: SocialUserDto) {
    try {
      const user = await this.userService.findOneByEmail(socialUserDto.email);
      if (user) {
        return this.generateToken(user);
      }

      const hashPassword = await bcrypt.hash(socialUserDto.email, 10);

      const newUser = {
        name: socialUserDto.username,
        email: socialUserDto.email,
        password: hashPassword,
      };

      const createdUser = await this.userService.create(newUser);

      return this.generateToken(createdUser);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error occurred while finding or creating user.',
      );
    }
  }

  async findOrCreateUserFromSocial(socialUserDto: SocialUserDto) {
    return this.findOrCreateUser(socialUserDto);
  }
}
