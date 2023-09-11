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
import { FacebookUserDto } from './dto/facebook-user.dto';
import { GoogleUserDto } from './dto/google-user.dto';

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
    const candidate = await this.userService.findOneByEmail(
      createUserDto.email,
    );
    if (candidate) {
      throw new HttpException(
        'User with this email already registered',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.userService.create({
      ...createUserDto,
      password: hashPassword,
    });

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
      const passwordEquals = await bcrypt.compare(
        loginUserDto.password,
        user.password,
      );

      if (user && passwordEquals) {
        return user;
      }
    } catch (error) {
      throw new UnauthorizedException({ message: 'Bad email or password' });
    }
  }

  async findOrCreateUserFromFacebook(facebookUserDto: FacebookUserDto) {
    try {
      const email = `${facebookUserDto.id}@${facebookUserDto.provider}.com`;
      const user = await this.userService.findOneByEmail(email);
      if (user) {
        return this.generateToken(user);
      }

      const hashPassword = await bcrypt.hash(email, 10);

      const newUser = await this.userService.create({
        name: facebookUserDto.displayName,
        email: email,
        password: hashPassword,
      });

      return this.generateToken(newUser);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error occurred while finding or creating user.',
      );
    }
  }

  async findOrCreateUserFromGoogle(googleUserDto: GoogleUserDto) {
    try {
      const user = await this.userService.findOneByEmail(
        googleUserDto.emails[0].value,
      );
      if (user) {
        return this.generateToken(user);
      }

      const hashPassword = await bcrypt.hash(googleUserDto.emails[0].value, 10);

      const newUser = await this.userService.create({
        name: googleUserDto.displayName,
        email: googleUserDto.emails[0].value,
        password: hashPassword,
      });

      return this.generateToken(newUser);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error occurred while finding or creating user.',
      );
    }
  }
}
