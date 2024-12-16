import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getDefault(): object {
    const message = {
      version: process.env.VERSION ?? 'unknown',
    };
    return message;
  }
}
