import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

@Injectable()
export class SpotifyMiddleware implements NestMiddleware {
  private readonly clientId = process.env.SPOTIFY_CLIENT_ID; // Ensure these are set in your env
  private readonly clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Check if an access token already exists (optional optimization)
      if (!req.headers['spotify-access-token']) {
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

        const accessToken = tokenResponse.data.access_token;

        // Add the access token to the request headers for downstream handlers
        req.headers['spotify-access-token'] = accessToken;
      }
      next();
    } catch (error) {
      console.error('Error fetching Spotify access token:', error);
      res.status(500).json({ message: 'Failed to authenticate with Spotify' });
    }
  }
}
