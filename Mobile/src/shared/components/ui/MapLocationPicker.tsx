import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { type Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { theme } from '../../../theme';
import { CustomText } from './CustomText';
import { AppMap } from './AppMap';
import { PawMarkerPin, PAW_MARKER_SIZE } from './PawMarkerPin';
import { storage } from '../../services/storage';
import { coordsToAddress } from '../../utils/geocoding';
import type { SelectedLocation } from '../../services/locationService';

interface MapLocationPickerProps {
  visible: boolean;
  initialLocation?: { latitude: number; longitude: number } | null | undefined;
  onConfirm: (location: SelectedLocation) => void;
  onClose: () => void;
}

type Coordinates = { latitude: number; longitude: number };

// Fallback cuando no hay selección previa ni ubicación del usuario
const DEFAULT_CENTER: Coordinates = { latitude: -34.9214, longitude: -57.9544 };

// La punta del pin de la app está a ~0.976 de su altura; este offset la
// deja exactamente sobre el centro del mapa (misma estética que Explorar).
const PIN_TIP_OFFSET = Math.round(2 * (0.976 - 0.5) * PAW_MARKER_SIZE);

export const MapLocationPicker = ({
  visible,
  initialLocation,
  onConfirm,
  onClose,
}: MapLocationPickerProps) => {
  const insets = useSafeAreaInsets();
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);
  const [center, setCenter] = useState<Coordinates>(DEFAULT_CENTER);
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    if (!visible) {
      setInitialRegion(null);
      setResolving(false);
      return;
    }

    let cancelled = false;
    const resolveRegion = async () => {
      let coords: Coordinates | null = initialLocation ?? null;
      let delta = 0.005;

      if (!coords) {
        try {
          let permission = await Location.getForegroundPermissionsAsync();
          if (permission.status === 'undetermined') {
            permission = await Location.requestForegroundPermissionsAsync();
          }
          if (permission.status === 'granted') {
            const position = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });
            coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            delta = 0.01;
          }
        } catch {
          // sin permiso o sin señal: seguimos con los fallbacks
        }
      }

      if (!coords) {
        coords = (await storage.getLocationCoords()) ?? DEFAULT_CENTER;
        delta = 0.05;
      }

      if (cancelled) return;
      setCenter(coords);
      setInitialRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: delta,
        longitudeDelta: delta,
      });
    };

    resolveRegion();
    return () => {
      cancelled = true;
    };
  }, [visible, initialLocation]);

  const handleConfirm = async () => {
    setResolving(true);
    try {
      const formattedAddress = await coordsToAddress(center.latitude, center.longitude);
      onConfirm({
        formattedAddress,
        latitude: center.latitude,
        longitude: center.longitude,
      });
    } finally {
      setResolving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.container}>
        {initialRegion ? (
          <>
            <AppMap
              style={styles.map}
              initialRegion={initialRegion}
              onRegionChangeComplete={(region) => {
                setCenter({ latitude: region.latitude, longitude: region.longitude });
              }}
            />
            <View pointerEvents="none" style={styles.pinContainer}>
              <View style={styles.pinOffset}>
                <PawMarkerPin />
              </View>
            </View>
          </>
        ) : (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        )}

        <View pointerEvents="box-none" style={[styles.titleOverlay, { top: insets.top + 12 }]}>
          <View style={styles.titlePill}>
            <CustomText variant="body" color="textPrimary" style={styles.titleText}>
              Elegí la ubicación en el mapa
            </CustomText>
          </View>
        </View>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.footerCard}>
            <CustomText variant="body" color="textSecondary" style={styles.hint}>
              Movete por el mapa hasta que el pin quede sobre el punto exacto.
            </CustomText>
            <View style={styles.actions}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={onClose}
                style={styles.cancelButton}
              >
                <CustomText variant="body" color="white" style={styles.actionText}>
                  Cancelar
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleConfirm}
                disabled={resolving || !initialRegion}
                style={[styles.confirmButton, (resolving || !initialRegion) && styles.confirmButtonDisabled]}
              >
                {resolving ? (
                  <ActivityIndicator size="small" color={theme.colors.white} />
                ) : (
                  <CustomText variant="body" color="white" style={styles.actionText}>
                    Confirmar
                  </CustomText>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinOffset: {
    marginBottom: PIN_TIP_OFFSET,
  },
  titleOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  titlePill: {
    paddingHorizontal: theme.spacing.lg,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  titleText: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: 13,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
  },
  footerCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  hint: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  cancelButton: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.gray700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  actionText: {
    fontFamily: theme.typography.fontFamily.semiBold,
  },
});
