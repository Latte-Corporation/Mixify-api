import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): object {
    return this.appService.getDefault();
  }

  @Post()
  async setPassKey(
    @Body() body: { passKey: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const FRONTEND_URL = process.env.FRONTEND_URL;
    const domain = FRONTEND_URL.split('://')[1];

    if (await this.appService.isPassKey(body.passKey)) {
      res.cookie('passKey', body.passKey, {
        httpOnly: false,
        secure: true,
        sameSite: 'none',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        domain: domain,
      });
    } else {
      res.clearCookie('passKey');
      res.status(401).send('Invalid passKey');
    }
  }
}
