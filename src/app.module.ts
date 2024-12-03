import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpotifyMiddleware } from './spotify/spotify.middleware';
import { ConfigModule } from '@nestjs/config';
import { SpotifyModule } from './spotify/spotify.module';

@Module({
  imports: [ConfigModule.forRoot(), SpotifyModule],
  controllers: [AppController],
  providers: [AppService, SpotifyMiddleware],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SpotifyMiddleware).forRoutes('*');
  }
}
