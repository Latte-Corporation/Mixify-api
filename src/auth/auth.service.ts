import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async signIn(pass: string): Promise<string> {
    const dashboardPassword = process.env.DASHBOARD_PASSWORD;
    if (dashboardPassword !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: 'dj' };
    return this.jwtService.signAsync(payload);
  }
}
