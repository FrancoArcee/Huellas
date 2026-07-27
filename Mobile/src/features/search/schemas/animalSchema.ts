import { z } from 'zod';

export const backendAnimalSchema = z.object({
  id: z.string(),
  name: z.string(),
  photosUrl: z.array(z.string()).default([]),
  category: z.string().default(''),
  size: z.string().optional(),
  age: z.number().optional(),
  unidadTiempo: z.string().optional(),
  weight: z.number().optional(),
  gender: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  location: z.string().optional(),
  description: z.string().nullable().optional(),
  userId: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  status: z.string().optional(),
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
  userId: z.string().optional(),
  status: z.string().optional(),
});

export type AnimalDTO = z.infer<typeof animalSchema>;
export type BackendAnimalDTO = z.infer<typeof backendAnimalSchema>;

export const mapBackendAnimalToDTO = (backend: BackendAnimalDTO): AnimalDTO => ({
  id: backend.id,
  name: backend.name,
  photoUri: backend.photosUrl[0] || '',
  distanceKm: 0,
  type: backend.category,
  gender: backend.gender || '',
  age: backend.age
    ? `${backend.age} ${backend.unidadTiempo === 'meses' ? (backend.age === 1 ? 'mes' : 'meses') : (backend.age === 1 ? 'año' : 'años')}`
    : '',
  weightKg: backend.weight || 0,
  latitude: backend.latitude,
  longitude: backend.longitude,
  userId: backend.userId,
  status: backend.status,
});
