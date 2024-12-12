import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

@Injectable()
export class SongsService {
  private readonly prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async submitSong(id: string, accessToken: string) {
    const url = `https://api.spotify.com/v1/tracks/${id}?market=FR`;
    const bpmUrl = `https://api.spotify.com/v1/audio-features/${id}`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status !== 200) {
        throw new Error('Failed to fetch data from Spotify API');
      }

      const bpmResponse = await axios.get(bpmUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const bpms = bpmResponse.status === 200 ? bpmResponse.data.tempo : 0;

      return this.prisma.song.create({
        data: {
          id: response.data.id,
          title: response.data.name,
          artist: response.data.artists
            .map((artist: any) => artist.name)
            .join(', '),
          link: response.data.external_urls.spotify,
          bpm: parseInt(bpms),
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
        orderBy: {
          createdAt: 'asc',
        },
      })
      .then((songs) =>
        songs.map((song) => ({
          id: song.id,
          title: song.title,
          artists: song.artist,
          submittedAt: song.createdAt,
          link: song.link,
          bpm: song.bpm,
        })),
      );
  }

  async getQueueSongs() {
    return this.prisma.song
      .findMany({
        where: {
          status: 'queued',
        },
        orderBy: {
          createdAt: 'asc',
        },
      })
      .then((songs) =>
        songs.map((song) => ({
          id: song.id,
          title: song.title,
          artists: song.artist,
          submittedAt: song.createdAt,
          link: song.link,
          bpm: song.bpm,
        })),
      );
  }

  async approveSong(id: string) {
    return this.prisma.song.update({
      where: {
        id,
      },
      data: {
        status: 'queued',
      },
    });
  }

  async passedSong(id: string) {
    return this.prisma.song.update({
      where: {
        id,
      },
      data: {
        status: 'passed',
      },
    });
  }

  async rejectSong(id: string) {
    return this.prisma.song.update({
      where: {
        id,
      },
      data: {
        status: 'rejected',
      },
    });
  }

  async reset() {
    await this.prisma.song.deleteMany();
  }
}
