import { HttpError } from "../../../shared/errors/HttpError";

const GEOREF_BASE_URL = "https://apis.datos.gob.ar/georef/api/v2.0";

type Coordinates = {
  lat: number | null;
  lon: number | null;
};

type GeorefEntity = {
  id: string | null;
  nombre: string | null;
};

type GeorefLocality = {
  id: string;
  nombre: string;
  centroide: Coordinates;
  departamento?: GeorefEntity;
  provincia?: GeorefEntity;
};

type GeorefAddress = {
  altura?: {
    valor?: number | null;
  };
  calle?: GeorefEntity;
  localidad?: GeorefEntity;
  localidad_censal?: GeorefEntity;
  departamento?: GeorefEntity;
  provincia?: GeorefEntity;
  nomenclatura: string;
  ubicacion?: Coordinates;
};

type LocalitiesResponse = {
  localidades?: GeorefLocality[];
};

type AddressesResponse = {
  direcciones?: GeorefAddress[];
};

export interface LocationBias {
  latitude: number;
  longitude: number;
}

export interface LocationSuggestion {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
  formattedAddress: string;
  latitude: number;
  longitude: number;
}

async function georefGet<T>(
  resource: string,
  params: Record<string, string | number>,
): Promise<T> {
  const url = new URL(`${GEOREF_BASE_URL}/${resource}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  let response: globalThis.Response;
  try {
    response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Huellas/1.0",
      },
      signal: AbortSignal.timeout(8000),
    });
  } catch (error) {
    console.error("Georef connection error:", error);
    throw new HttpError(
      502,
      "GEOREF_UNAVAILABLE",
      "El servicio de direcciones no está disponible en este momento.",
    );
  }

  if (!response.ok) {
    const body = await response.text();
    console.error("Georef error:", response.status, body);
    throw new HttpError(
      502,
      "GEOREF_PROVIDER_ERROR",
      "El servicio de direcciones no pudo completar la búsqueda.",
    );
  }

  return response.json() as Promise<T>;
}

function distanceKm(a: LocationBias, b: LocationBias): number {
  const toRadians = (degrees: number) => degrees * Math.PI / 180;
  const latitudeDelta = toRadians(b.latitude - a.latitude);
  const longitudeDelta = toRadians(b.longitude - a.longitude);
  const firstLatitude = toRadians(a.latitude);
  const secondLatitude = toRadians(b.latitude);
  const value =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(firstLatitude) *
      Math.cos(secondLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

function localitySecondaryText(locality: GeorefLocality): string {
  return [locality.departamento?.nombre, locality.provincia?.nombre]
    .filter(Boolean)
    .join(", ");
}

async function localityCenters(
  addresses: GeorefAddress[],
): Promise<Map<string, GeorefLocality>> {
  const ids = [...new Set(addresses.flatMap((address) => {
    const id = address.localidad?.id ?? address.localidad_censal?.id;
    return id ? [id] : [];
  }))];

  const results = await Promise.allSettled(
    ids.map(async (id) => {
      const response = await georefGet<LocalitiesResponse>("localidades", { id });
      return response.localidades?.[0];
    }),
  );

  const centers = new Map<string, GeorefLocality>();
  results.forEach((result) => {
    if (result.status === "fulfilled" && result.value) {
      centers.set(result.value.id, result.value);
    }
  });
  return centers;
}

function addressSuggestion(
  address: GeorefAddress,
  centers: Map<string, GeorefLocality>,
): LocationSuggestion | null {
  const localityId = address.localidad?.id ?? address.localidad_censal?.id;
  const fallback = localityId ? centers.get(localityId) : undefined;
  const latitude = address.ubicacion?.lat ?? fallback?.centroide.lat;
  const longitude = address.ubicacion?.lon ?? fallback?.centroide.lon;
  if (latitude === null || latitude === undefined || longitude === null || longitude === undefined) {
    return null;
  }

  const isApproximate = address.ubicacion?.lat == null || address.ubicacion?.lon == null;
  const mainText = [
    address.calle?.nombre,
    address.altura?.valor,
  ].filter(Boolean).join(" ");
  const localityName =
    address.localidad?.nombre ??
    address.localidad_censal?.nombre ??
    address.departamento?.nombre;
  const secondaryText = [
    localityName,
    address.provincia?.nombre,
    isApproximate ? "ubicación aproximada" : null,
  ].filter(Boolean).join(", ");
  const placeId = [
    "georef",
    "direccion",
    address.calle?.id ?? "sin-calle",
    address.altura?.valor ?? "sin-altura",
    localityId ?? "sin-localidad",
  ].join(":");

  return {
    placeId,
    description: address.nomenclatura,
    mainText: mainText || address.nomenclatura,
    secondaryText,
    formattedAddress: address.nomenclatura,
    latitude,
    longitude,
  };
}

function localitySuggestion(locality: GeorefLocality): LocationSuggestion | null {
  const latitude = locality.centroide.lat;
  const longitude = locality.centroide.lon;
  if (latitude === null || longitude === null) return null;
  const secondaryText = localitySecondaryText(locality);
  const formattedAddress = [locality.nombre, secondaryText].filter(Boolean).join(", ");

  return {
    placeId: `georef:localidad:${locality.id}`,
    description: formattedAddress,
    mainText: locality.nombre,
    secondaryText,
    formattedAddress,
    latitude,
    longitude,
  };
}

export const locationService = {
  async autocomplete(input: string, bias?: LocationBias): Promise<LocationSuggestion[]> {
    const [addressesResult, localitiesResult] = await Promise.allSettled([
      georefGet<AddressesResponse>("direcciones", {
        direccion: input,
        max: 5,
      }),
      georefGet<LocalitiesResponse>("localidades", {
        nombre: input,
        max: 5,
      }),
    ]);

    if (addressesResult.status === "rejected" && localitiesResult.status === "rejected") {
      throw addressesResult.reason;
    }

    const addresses = addressesResult.status === "fulfilled"
      ? addressesResult.value.direcciones ?? []
      : [];
    const localities = localitiesResult.status === "fulfilled"
      ? localitiesResult.value.localidades ?? []
      : [];
    const centers = await localityCenters(addresses);
    const addressSuggestions = addresses
      .map((address) => addressSuggestion(address, centers))
      .filter((suggestion): suggestion is LocationSuggestion => suggestion !== null);
    const localitySuggestions = localities
      .map(localitySuggestion)
      .filter((suggestion): suggestion is LocationSuggestion => suggestion !== null);
    const containsStreetNumber = /\d/.test(input);
    const suggestions = containsStreetNumber
      ? [...addressSuggestions, ...localitySuggestions]
      : [...localitySuggestions, ...addressSuggestions];

    const unique = [...new Map(
      suggestions.map((suggestion) => [suggestion.placeId, suggestion]),
    ).values()];

    if (bias) {
      unique.sort((first, second) =>
        distanceKm(bias, first) - distanceKm(bias, second),
      );
    }

    return unique.slice(0, 8);
  },
};
