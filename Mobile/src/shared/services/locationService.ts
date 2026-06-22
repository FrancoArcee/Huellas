import { api } from './api';

export interface LocationSuggestion {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
  formattedAddress: string;
  latitude: number;
  longitude: number;
}

export interface SelectedLocation {
  formattedAddress: string;
  latitude: number;
  longitude: number;
  placeId?: string;
}

export interface LocationBias {
  latitude: number;
  longitude: number;
}

export const locationService = {
  async autocomplete(
    input: string,
    bias?: LocationBias,
  ): Promise<LocationSuggestion[]> {
    const response = await api.get('/locations/autocomplete', {
      params: {
        input,
        ...(bias ?? {}),
      },
    });
    return response.data.data;
  },
};
