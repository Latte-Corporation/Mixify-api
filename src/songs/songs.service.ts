import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { filter, map, Subject } from 'rxjs';

@Injectable()
export class SongsService {
  private readonly prisma: PrismaClient;
  private readonly eventsSubject: Subject<{
    queueNumber: number;
    idUser: string;
  }>;
  constructor() {
    this.prisma = new PrismaClient();
    this.eventsSubject = new Subject();
  }

  async submitSong(id: string, accessToken: string, user: string) {
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
          link: response.data.external_urls.spotify,
          user: {
            connect: {
              passKey: user,
            },
          },
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
        })),
      );
  }

  async approveSong(id: string) {
    const song = await this.prisma.song.update({
      where: {
        id,
      },
      data: {
        status: 'queued',
        createdAt: new Date(),
      },
    });

    this.eventsSubject.next({
      queueNumber: await this.prisma.song.count({
        where: {
          status: 'queued',
        },
      }),
      idUser: song.userId,
    });

    return song;
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

  async getSongEvents(id: string) {
    return this.eventsSubject.asObservable().pipe(
      filter((event) => event.idUser === id),
      map((event) => ({ data: event })),
    );
  }

  async reset() {
    await this.prisma.song.deleteMany();
  }
}
