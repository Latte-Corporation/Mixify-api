import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpotifyMiddleware } from './spotify/spotify.middleware';
import { ConfigModule } from '@nestjs/config';
import { SpotifyModule } from './spotify/spotify.module';
import { SongsModule } from './songs/songs.module';
import { HealthModule } from './health/health.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot(), SpotifyModule, SongsModule, HealthModule, AuthModule],
  controllers: [AppController, AuthController],
  providers: [AppService, SpotifyMiddleware, AuthService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SpotifyMiddleware).forRoutes('*');
  }
}
