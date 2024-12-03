import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SpotifyService {
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

      return response.data.tracks.items.map((item: any) => ({
        id: item.id,
        title: item.name,
        artists: item.artists.map((artist: any) => artist.name).join(', '),
      }));
    } catch (error) {
      console.error('Error fetching data from Spotify API', error);
      throw error;
    }
  }
}
