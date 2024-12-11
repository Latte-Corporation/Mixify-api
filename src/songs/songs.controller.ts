import { Controller, Get, Param, Post, Req, Sse } from '@nestjs/common';
import { SongsService } from './songs.service';
import { map, Subject } from 'rxjs';

@Controller('songs')
export class SongsController {
  private readonly songService: SongsService;
  private readonly songAddedSubject = new Subject<any>();
  private readonly songStatusSubject = new Subject<any>();

  constructor() {
    this.songService = new SongsService();
  }

  @Post('submit/:id')
  async submitSong(@Param('id') id: string, @Req() req: Request) {
    const accessToken = req.headers['spotify-access-token'];
    const result = await this.songService.submitSong(id, accessToken);
    this.songAddedSubject.next({ id, status: 'pending' });
    return result;
  }

  @Get('pending')
  async getPendingSongs() {
    return this.songService.getPendingSongs();
  }

  @Get('queue')
  async getQueueSongs() {
    return this.songService.getQueueSongs();
  }

  @Post('approve/:id')
  async approveSong(@Param('id') id: string) {
    this.songStatusSubject.next({ id, status: 'approved' });
    return this.songService.approveSong(id);
  }

  @Post('reject/:id')
  async rejectSong(@Param('id') id: string) {
    this.songStatusSubject.next({ id, status: 'rejected' });
    return this.songService.rejectSong(id);
  }

  @Post('passed/:id')
  async passedSong(@Param('id') id: string) {
    this.songStatusSubject.next({ id, status: 'passed' });
    return this.songService.passedSong(id);
  }

  @Sse('sse')
  async sse() {
    return this.songAddedSubject.asObservable().pipe(map((data) => ({ data })));
  }

  @Sse('status')
  async status() {
    return this.songStatusSubject
      .asObservable()
      .pipe(map((data) => ({ data })));
  }
}
