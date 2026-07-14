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
  status?: string;
  latitude?: number;
  longitude?: number;
  location?: string;
  placeId?: string;
  radius?: number;
  minAge?: number;
  maxAge?: number;
  neutered?: boolean;
  limit?: number;
}

export async function fetchAnimals(params: FetchAnimalsParams): Promise<AnimalDTO[]> {
  // Solo se descarta la localidad (texto + placeId) cuando el geo-filtro por
  // radio está activo (el backend ignora lat/lng si no viene radius). Sin
  // radio, el placeId permite al backend filtrar por pertenencia real a la
  // localidad/municipio en lugar de comparar texto.
  const geoFilterActive =
    params.latitude !== undefined &&
    params.longitude !== undefined &&
    params.radius !== undefined;
  const normalizedParams = geoFilterActive
    ? { ...params, location: undefined, placeId: undefined }
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
