import * as Location from 'expo-location';

export function formatReverseGeocode(address: Location.LocationGeocodedAddress): string {
  return [
    [address.street, address.streetNumber].filter(Boolean).join(' '),
    address.district,
    address.city,
    address.region,
    address.country,
  ].filter(Boolean).join(', ');
}

/**
 * Convierte coordenadas en una dirección legible con reverse geocoding.
 * Si el geocoder falla o no devuelve resultados, cae a un texto con las
 * coordenadas para que la selección siga siendo válida.
 */
export async function coordsToAddress(latitude: number, longitude: number): Promise<string> {
  try {
    const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (addresses[0]) {
      const formatted = formatReverseGeocode(addresses[0]);
      if (formatted) return formatted;
    }
  } catch {
    // sin conexión o geocoder no disponible: usamos el fallback
  }
  return `Ubicación elegida en el mapa (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`;
}
