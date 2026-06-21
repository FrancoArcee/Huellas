import { z } from 'zod';

export const backendAnimalSchema = z.object({
  id: z.string(),
  name: z.string(),
  photosUrl: z.array(z.string()).default([]),
  category: z.string().default(''),
  size: z.string().optional(),
  age: z.number().optional(),
  weight: z.number().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  location: z.string().optional(),
  description: z.string().nullable().optional(),
  userId: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const backendAnimalsResponseSchema = z.array(backendAnimalSchema);

export const animalSchema = z.object({
  id: z.string(),
  name: z.string(),
  photoUri: z.string(),
  distanceKm: z.number(),
  type: z.string(),
  gender: z.string(),
  age: z.string(),
  weightKg: z.number(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type AnimalDTO = z.infer<typeof animalSchema>;
export type BackendAnimalDTO = z.infer<typeof backendAnimalSchema>;

export const mapBackendAnimalToDTO = (backend: BackendAnimalDTO): AnimalDTO => ({
  id: backend.id,
  name: backend.name,
  photoUri: backend.photosUrl[0] || '',
  distanceKm: 0,
  type: backend.category,
  gender: '',
  age: backend.age ? `${backend.age} años` : '',
  weightKg: backend.weight || 0,
  latitude: backend.latitude,
  longitude: backend.longitude,
});
