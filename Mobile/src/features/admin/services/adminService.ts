import type { ImagePickerAsset } from 'expo-image-picker';
import { api } from '../../../shared/services/api';

export interface AnimalPostRecord {
  id: string;
  userId: string;
  name: string;
  age: number;
  weight: number;
  size: 'small' | 'medium' | 'large';
  category: 'dog' | 'cat' | 'other';
  gender: 'male' | 'female';
  neutered: boolean;
  latitude: number;
  longitude: number;
  location: string;
  birthDate: string | null;
  description: string | null;
  photosUrl: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AnimalPostPayload {
  name: string;
  age: number;
  weight: number;
  size: AnimalPostRecord['size'];
  category: AnimalPostRecord['category'];
  gender: AnimalPostRecord['gender'];
  neutered: boolean;
  latitude: number;
  longitude: number;
  location: string;
  birthDate?: string;
  description?: string;
}

function appendAsset(form: FormData, asset: ImagePickerAsset): void {
  if (asset.file) {
    form.append('photos', asset.file);
    return;
  }

  form.append('photos', {
    uri: asset.uri,
    name: asset.fileName ?? `animal-${Date.now()}.jpg`,
    type: asset.mimeType ?? 'image/jpeg',
  } as unknown as Blob);
}

function buildFormData(
  payload: AnimalPostPayload,
  photos: ImagePickerAsset[],
  existingPhotosUrl?: string[],
): FormData {
  const form = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    form.append(key, String(value));
  });

  if (existingPhotosUrl) {
    form.append('existingPhotosUrl', JSON.stringify(existingPhotosUrl));
  }

  photos.forEach((asset) => appendAsset(form, asset));
  return form;
}

const multipartConfig = {
  headers: { 'Content-Type': 'multipart/form-data' },
};

export const adminService = {
  async listByUser(userId: string): Promise<AnimalPostRecord[]> {
    const response = await api.get('/animals', {
      params: { userId, limit: 100 },
    });
    return response.data.data.posts;
  },

  async create(
    payload: AnimalPostPayload,
    photos: ImagePickerAsset[],
  ): Promise<AnimalPostRecord> {
    const response = await api.post(
      '/animals',
      buildFormData(payload, photos),
      multipartConfig,
    );
    return response.data.data;
  },

  async update(
    id: string,
    payload: AnimalPostPayload,
    photos: ImagePickerAsset[],
    existingPhotosUrl: string[],
  ): Promise<AnimalPostRecord> {
    const response = await api.put(
      `/animals/${id}`,
      buildFormData(payload, photos, existingPhotosUrl),
      multipartConfig,
    );
    return response.data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/animals/${id}`);
  },
};
