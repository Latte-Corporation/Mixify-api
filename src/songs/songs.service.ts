import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

@Injectable()
export class SongsService {
  private readonly prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async submitSong(id: number, accessToken: string) {
    const url = `https://api.spotify.com/v1/tracks/${id}?market=FR`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status !== 200) {
        throw new Error('Failed to fetch data from Spotify API');
      }

      return this.prisma.song.create({
        data: {
          id: response.data.id,
          title: response.data.name,
          artist: response.data.artists
            .map((artist: any) => artist.name)
            .join(', '),
        },
      });
    } catch (error) {
      console.error('Error saving song', error);
      throw error;
    }
  }

  async getPendingSongs() {
    return this.prisma.song
      .findMany({
        where: {
          status: 'pending',
        },
      })
      .then((songs) =>
        songs.map((song) => ({
          id: song.id,
          title: song.title,
          artists: song.artist,
        })),
      );
  }

  async getQueueSongs() {
    return this.prisma.song
      .findMany({
        where: {
          status: 'queued',
        },
      })
      .then((songs) =>
        songs.map((song) => ({
          id: song.id,
          title: song.title,
          artists: song.artist,
        })),
      );
  }
}
