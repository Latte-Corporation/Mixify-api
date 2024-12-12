import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

@Injectable()
export class SpotifyService {
  private readonly prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async search(query: string, accessToken: string) {
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&market=FR`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status !== 200) {
        throw new Error('Failed to fetch data from Spotify API');
      }

      const allSongs = await this.prisma.song.findMany({
        where: {
          status: 'queued',
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      const tracks = await Promise.all(
        response.data.tracks.items.map(async (item: any) => {
          const song = await this.prisma.song.findUnique({
            where: { id: item.id },
          });

          const place = song
            ? allSongs.findIndex((s) => s.id === song.id) + 1
            : null;

          return {
            id: item.id,
            title: item.name,
            artists: item.artists.map((artist: any) => artist.name).join(', '),
            status: song?.status || null,
            place,
          };
        }),
      );
      return tracks;
    } catch (error) {
      console.error('Error fetching data from Spotify API', error);
      throw error;
    }
  }
}
