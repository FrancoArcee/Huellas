import { api } from '../../../shared/services/api';
import {
  AnimalDTO,
  backendAnimalsResponseSchema,
  mapBackendAnimalToDTO,
} from '../schemas/animalSchema';

export interface FetchAnimalsParams {
  search?: string;
  category?: string;
  size?: string;
  gender?: string;
  latitude?: number;
  longitude?: number;
  location?: string;
  radius?: number;
  minAge?: number;
  maxAge?: number;
  minWeight?: number;
  maxWeight?: number;
  limit?: number;
}

export async function fetchAnimals(params: FetchAnimalsParams): Promise<AnimalDTO[]> {
  // Solo se descarta la localidad textual cuando el geo-filtro por radio está
  // activo (el backend ignora lat/lng si no viene radius).
  const geoFilterActive =
    params.latitude !== undefined &&
    params.longitude !== undefined &&
    params.radius !== undefined;
  const normalizedParams = geoFilterActive
    ? { ...params, location: undefined }
    : { ...params, radius: undefined };
  const queryParams = Object.fromEntries(
    Object.entries({
      ...normalizedParams,
      q: params.search,
      search: undefined,
    }).filter(([, value]) => value !== undefined && value !== ''),
  );

  const response = await api.get('/animals', { params: queryParams });
  const payload = response.data?.data?.posts ?? response.data?.posts ?? response.data;
  const parsed = backendAnimalsResponseSchema.safeParse(payload);

  if (!parsed.success) {
    console.warn('Invalid animals response', parsed.error);
    return [];
  }

  return parsed.data.map(mapBackendAnimalToDTO);
}
