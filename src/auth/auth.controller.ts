import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: Record<string, any>,
    @Res({ passthrough: true }) res: Response,
  ) {
    const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN;
    const accessToken = await this.authService.signIn(signInDto.password);
    res.cookie('accessToken', accessToken, {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 5),
      domain: COOKIE_DOMAIN,
    });
  }
}
