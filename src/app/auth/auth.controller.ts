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
import { Request, Response } from 'express';

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

  @ApiOperation({
    summary: 'Login to app using Google account data from front',
  })
  @ApiResponse({ status: 200, type: String })
  @Post('/loginWithGoogle')
  async loginWithGoogle(@Body() loginData: any, @Res() res: Response) {
    const user = await this.authService.findOrCreateUserFromSocial(loginData);

    if (user.token) return res.status(200).send(user);
    else res.redirect('/auth/register');
  }





  // Need to check this all this bellow again. Social logil work by lib on front
  @ApiOperation({ summary: 'Login to app using Google account' })
  @ApiResponse({ status: 200, type: String })
  @Get('/google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  @ApiOperation({ summary: 'Login to app using Google account' })
  @ApiResponse({ status: 200, type: String })
  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req: Request, @Res() res: Response) {
    const loginData: any = req.user;
    const user = await this.authService.findOrCreateUserFromSocial(loginData);

    if (user.token) return res.status(200).send(user);
    else res.redirect('http://localhost:4200/auth/register');
  }

  @ApiOperation({ summary: 'Login to app using Facebook account' })
  @ApiResponse({ status: 200, type: String })
  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookLogin() {}

  @ApiOperation({ summary: 'Login to app using Facebook account' })
  @ApiResponse({ status: 200, type: String })
  @Get('/facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginCallback(@Req() req: Request, @Res() res: Response) {
    const loginData: any = req.user;
    const user = await this.authService.findOrCreateUserFromSocial(loginData);

    if (user.token) return res.json(user);
    else res.redirect('http://localhost:4200/auth/register');
  }
}
