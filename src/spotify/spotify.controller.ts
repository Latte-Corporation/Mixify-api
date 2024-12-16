import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('spotify')
export class SpotifyController {
  private readonly spotifyService: SpotifyService;

  constructor() {
    this.spotifyService = new SpotifyService();
  }

  @Get('search/:query')
  async search(@Req() req: Request, @Param('query') query: string) {
    const accessToken = req.headers['spotify-access-token'];
    return this.spotifyService.search(query, accessToken);
  }
}
