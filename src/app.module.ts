import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpotifyMiddleware } from './spotify/spotify.middleware';
import { ConfigModule } from '@nestjs/config';
import { SpotifyModule } from './spotify/spotify.module';
import { SongsModule } from './songs/songs.module';

@Module({
  imports: [ConfigModule.forRoot(), SpotifyModule, SongsModule],
  controllers: [AppController],
  providers: [AppService, SpotifyMiddleware],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SpotifyMiddleware).forRoutes('*');
  }
}
