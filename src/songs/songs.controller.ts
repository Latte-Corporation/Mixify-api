import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { map, Subject } from 'rxjs';
import { AuthGuard } from 'src/auth/auth.guard';
import { DashboardGuard } from 'src/dashboard/dashboard.guard';

@Controller('songs')
export class SongsController {
  private readonly songService: SongsService;
  private readonly songAddedSubject = new Subject<any>();
  private readonly songStatusSubject = new Subject<any>();

  constructor() {
    this.songService = new SongsService();
  }

  @UseGuards(AuthGuard)
  @Post('submit/:id')
  async submitSong(@Param('id') id: string, @Req() req: Request) {
    const accessToken = req.headers['spotify-access-token'];
    const result = await this.songService.submitSong(
      id,
      accessToken,
      req['user'],
    );
    this.songAddedSubject.next({ id, status: 'pending' });
    return result;
  }

  @UseGuards(DashboardGuard)
  @Get('pending')
  async getPendingSongs() {
    return this.songService.getPendingSongs();
  }

  @UseGuards(DashboardGuard)
  @Get('queue')
  async getQueueSongs() {
    return this.songService.getQueueSongs();
  }

  @UseGuards(DashboardGuard)
  @Post('approve/:id')
  async approveSong(@Param('id') id: string) {
    this.songStatusSubject.next({ id, status: 'approved' });
    return this.songService.approveSong(id);
  }

  @UseGuards(DashboardGuard)
  @Post('reject/:id')
  async rejectSong(@Param('id') id: string) {
    this.songStatusSubject.next({ id, status: 'rejected' });
    return this.songService.rejectSong(id);
  }

  @UseGuards(DashboardGuard)
  @Post('passed/:id')
  async passedSong(@Param('id') id: string) {
    this.songStatusSubject.next({ id, status: 'passed' });
    return this.songService.passedSong(id);
  }

  @UseGuards(DashboardGuard)
  @Post('reset')
  async reset() {
    this.songStatusSubject.next({ status: 'reset' });
    this.songAddedSubject.next({ status: 'reset' });
    return this.songService.reset();
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

  @UseGuards(AuthGuard)
  @Sse('events/:id')
  async events(@Param('id') id: string) {
    return this.songService.getSongEvents(id);
  }
}
