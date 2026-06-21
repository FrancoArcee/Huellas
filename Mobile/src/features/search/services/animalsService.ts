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
  latitude?: number;
  longitude?: number;
  location?: string;
}

export async function fetchAnimals(params: FetchAnimalsParams): Promise<AnimalDTO[]> {
  const queryParams = Object.fromEntries(
    Object.entries({
      ...params,
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
