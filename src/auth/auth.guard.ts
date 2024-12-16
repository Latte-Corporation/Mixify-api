import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const passKey = request.cookies['passKey'];

    if (!passKey) {
      return false;
    }

    const isAuth = await this.prisma.user
      .findUnique({
        where: {
          passKey: passKey,
        },
      })
      .then((user) => !!user);

    request['user'] = passKey;
    return isAuth;
  }
}
