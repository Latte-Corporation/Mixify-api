import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { SongsService } from './songs.service';

@Controller('songs')
export class SongsController {
  private readonly songService: SongsService;
  constructor() {
    this.songService = new SongsService();
  }

  @Post('submit/:id')
  async submitSong(@Param('id') id: number, @Req() req: Request) {
    const accessToken = req.headers['spotify-access-token'];
    return this.songService.submitSong(id, accessToken);
  }

  @Get('pending')
  async getPendingSongs() {
    return this.songService.getPendingSongs();
  }

  @Get('queue')
  async getQueueSongs() {
    return this.songService.getQueueSongs();
  }
}
