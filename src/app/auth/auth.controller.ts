import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login USER' })
  @ApiResponse({ status: 200, type: String })
  @Post('/login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @ApiOperation({ summary: 'Create USER' })
  @ApiResponse({ status: 201, type: String })
  @Post('/registration')
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto);
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    console.log('// initiates the Google OAuth2 login flow');
  }

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req, @Res() res) {
    const user: any = req.user;
    if (user)
      res.redirect(
        'http://localhost:4200/review/latest?quantity=10&offset=0&orderBy=createdAt&direction=DESC',
      );
    else res.redirect('http://localhost:4200/auth/register');
  }
}
