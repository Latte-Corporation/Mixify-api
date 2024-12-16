import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AppService {
  private readonly prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }
  getDefault(): object {
    const message = {
      version: process.env.VERSION ?? 'unknown',
    };
    return message;
  }

  async isPassKey(passKey: string): Promise<boolean> {
    const passKeyExists = await this.prisma.user
      .findFirst({
        where: {
          passKey,
        },
      })
      .then((user) => !!user);
    return passKeyExists;
  }
  getHello(): string {
    return 'Hello World!';
  }
}
