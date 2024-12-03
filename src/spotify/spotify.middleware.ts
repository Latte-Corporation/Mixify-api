import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

@Injectable()
export class SpotifyMiddleware implements NestMiddleware {
  private readonly clientId = process.env.SPOTIFY_CLIENT_ID;
  private readonly clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  private accessToken: string | null = null;
  private tokenExpiration: number | null = null;

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const currentTime = Math.floor(Date.now() / 1000);

      if (
        !this.accessToken ||
        !this.tokenExpiration ||
        currentTime >= this.tokenExpiration
      ) {
        const tokenResponse = await axios.post(
          'https://accounts.spotify.com/api/token',
          new URLSearchParams({ grant_type: 'client_credentials' }),
          {
            headers: {
              Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        );

        this.accessToken = tokenResponse.data.access_token;
        this.tokenExpiration = currentTime + tokenResponse.data.expires_in;
      }

      req.headers['spotify-access-token'] = this.accessToken;
      next();
    } catch (error) {
      console.error('Error fetching Spotify access token:', error);
      res.status(500).json({ message: 'Failed to authenticate with Spotify' });
    }
  }
}
