import React, { forwardRef } from 'react';
import MapView, { type MapViewProps } from 'react-native-maps';

/**
 * Mapa base de la app: un único punto de configuración para que todos
 * los mapas (explorar, selector de ubicación) se vean exactamente igual.
 *
 * Usa el mapa vectorial nativo (Google en Android, Apple en iOS): texto
 * nítido a cualquier zoom, sin descarga de tiles ni fondos negros.
 * `customMapStyle` aplica solo en Google y replica la estética clara
 * estilo Voyager que tenía la app con las tiles de CARTO.
 *
 * Nota builds propios de Android: requiere una API key de Google Maps
 * SDK en app.json → android.config.googleMaps.apiKey (en Expo Go no
 * hace falta).
 */

const voyagerStyle = [
  { elementType: 'geometry', stylers: [{ color: '#f8f6f1' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#5b5b52' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#c9b2a6' }],
  },
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#cdebc0' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ visibility: 'on' }, { color: '#6a9a5b' }],
  },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#e8e0d8' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#fddc9a' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#f2c66d' }],
  },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#aadaff' }] },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#4d7a99' }],
  },
];

export const AppMap = forwardRef<MapView, MapViewProps>((props, ref) => (
  <MapView
    ref={ref}
    customMapStyle={voyagerStyle}
    toolbarEnabled={false}
    // iOS: Apple Maps sigue el modo oscuro del sistema; la app es clara
    userInterfaceStyle="light"
    {...props}
  />
));

AppMap.displayName = 'AppMap';
