import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { FacebookAuthResult, UseFacebookAuth } from '@nestjs-hybrid-auth/all';

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

  @ApiOperation({ summary: 'Login with Facebook' })
  @ApiResponse({ status: 200, type: String })
  @UseFacebookAuth()
  @Get('/facebook')
  loginWithFacebook() {
    return 'Login with Facebook';
  }

  @ApiOperation({ summary: 'Redirect if login OK' })
  @ApiResponse({ status: 200, type: String })
  @UseFacebookAuth()
  @Get('/facebook/redirect')
  // facebookCallback(@Req() req: any): Partial<FacebookAuthResult> {
  facebookCallback(@Req() req: any) {
    const result: FacebookAuthResult = req.hybridAuthResult;
    const facebookUser = {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      profile: result.profile,
    };

    return this.authService.findOrCreateUserFromFacebook(facebookUser.profile);
  }
}
