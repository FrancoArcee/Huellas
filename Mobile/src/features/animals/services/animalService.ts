import { api } from '../../../shared/services/api';
import type { ContactTypeValues } from '@huellas/shared';

export interface AnimalPost {
  id: string;
  name: string;
  category: string;
  size: string;
  age: number;
  weight: number;
  gender: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  photosUrl: string[];
  userId: string;
  user: {
    id: string;
    name: string;
    image: string | null;
    contact: string;
    contactType: ContactTypeValues;
  };
  _count: { favorites: number };
  createdAt: string;
  updatedAt: string;
}

export interface FavoriteRecord {
  id: string;
  postId: string;
  userId: string;
  createdAt: string;
}

export const animalService = {
  async getAnimalDetail(id: string): Promise<AnimalPost> {
    const res = await api.get(`/animals/${id}`);
    return res.data.data;
  },

  async checkFavorite(postId: string): Promise<FavoriteRecord | null> {
    try {
      const res = await api.get(`/favorites/check/${postId}`);
      return res.data.data ?? null;
    } catch {
      return null;
    }
  },

  async addFavorite(postId: string): Promise<FavoriteRecord> {
    const res = await api.post('/favorites', { postId });
    return res.data.data;
  },

  async removeFavorite(favoriteId: string): Promise<void> {
    await api.delete(`/favorites/${favoriteId}`);
  },

  async getUserFavorites(userId: string): Promise<any[]> {
    const res = await api.get(`/favorites/user/${userId}`);
    return res.data.data;
  },
};
