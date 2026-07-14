import { useState, useEffect, useCallback } from 'react';
import { Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { storage } from '../../../shared/services/storage';
import { api } from '../../../shared/services/api';
import { animalService } from '../../animals/services/animalService';
import { getDistanceKm } from '../../../shared/utils/distance';
import * as Location from 'expo-location';
import { useAuthStore } from '../../../shared/store/authStore';
import { translateCategory, translateGender, formatAge } from '../../../shared/utils/translations';
import type { FilterValues } from '../components/FilterBottomSheet';

export const useHomeData = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const userId = user?.id;
  const [isFilterSheetVisible, setIsFilterSheetVisible] = useState(false);
  const [locationState, setLocationState] = useState<'loading' | 'granted' | 'denied'>('loading');
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [animals, setAnimals] = useState<any[]>([]);
  const [loadingAnimals, setLoadingAnimals] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<{ [postId: string]: string }>({});

  const openFilterSheet = () => {
    setIsFilterSheetVisible(true);
  };

  const closeFilterSheet = () => {
    setIsFilterSheetVisible(false);
  };

  const handleSearchSubmit = (search: string) => {
    router.push({
      pathname: '/(tabs)/search',
      params: { search, layout: 'list' },
    });
  };

  const handleApplyFilters = (filters: FilterValues) => {
    const params: Record<string, string> = { layout: 'map' };

    if (filters.category) params.category = filters.category;
    if (filters.size) params.size = filters.size;
    if (filters.location) params.location = filters.location;
    if (filters.latitude !== undefined && filters.longitude !== undefined) {
      params.latitude = String(filters.latitude);
      params.longitude = String(filters.longitude);
      params.radius = String(filters.radius);
    }

    router.push({
      pathname: '/(tabs)/search',
      params,
    });
  };

  const loadAnimalsData = useCallback(async (lat: number, lng: number) => {
    setLoadingAnimals(true);
    try {
      const response = await api.get('/animals');
      const posts = response.data?.data?.posts ?? response.data?.posts ?? [];

      const nearbyPosts = posts.filter((post: any) => {
        if (post.userId === userId) return false;
        if (post.latitude === undefined || post.longitude === undefined) return false;
        const dist = getDistanceKm(lat, lng, post.latitude, post.longitude);
        return dist <= 10;
      });

      if (nearbyPosts.length === 0) {
        setAnimals([]);
        setLoadingAnimals(false);
        return;
      }

      const detailedAnimals = await Promise.all(
        nearbyPosts.map(async (post: any) => {
          try {
            const detail = await animalService.getAnimalDetail(post.id);
            const dist = getDistanceKm(lat, lng, detail.latitude ?? 0, detail.longitude ?? 0);
            const favRecord = await animalService.checkFavorite(post.id);

            if (favRecord) {
              setFavoriteIds(prev => ({ ...prev, [post.id]: favRecord.id }));
            }

            return {
              id: detail.id,
              name: detail.name,
              photoUri: detail.photosUrl?.[0] || '',
              distanceKm: dist,
              type: translateCategory(detail.category),
              gender: translateGender((detail as any).gender),
              age: formatAge(detail.age),
              weightKg: detail.weight || 0,
              isFavorite: !!favRecord,
            };
          } catch (err) {
            console.error(`Error loading detail for animal ${post.id}:`, err);
            return null;
          }
        })
      );

      setAnimals(detailedAnimals.filter(Boolean));
    } catch (error) {
      console.warn('Error loading animals near user:', error);
    } finally {
      setLoadingAnimals(false);
    }
  }, []);

  const requestLocation = async () => {
    setLocationState('loading');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
        setUserCoords(coords);
        await storage.setLocation(coords.latitude, coords.longitude);
        setLocationState('granted');
        loadAnimalsData(coords.latitude, coords.longitude);
      } else {
        setLocationState('denied');
      }
    } catch (e) {
      console.warn('Error getting location:', e);
      setLocationState('denied');
    }
  };

  const checkLocationPermission = async () => {
    try {
      const savedCoords = await storage.getLocationCoords();
      if (savedCoords) {
        setUserCoords(savedCoords);
      }

      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
        setUserCoords(coords);
        await storage.setLocation(coords.latitude, coords.longitude);
        setLocationState('granted');
        loadAnimalsData(coords.latitude, coords.longitude);
      } else if (status === 'undetermined') {
        await requestLocation();
      } else {
        setLocationState('denied');
      }
    } catch (e) {
      console.warn('Error checking location permission:', e);
      setLocationState('denied');
    }
  };

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const handleEnableLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
        setUserCoords(coords);
        await storage.setLocation(coords.latitude, coords.longitude);
        setLocationState('granted');
        loadAnimalsData(coords.latitude, coords.longitude);
      } else {
        setLocationState('denied');
        Linking.openSettings();
      }
    } catch (e) {
      console.warn('Error enabling location:', e);
      setLocationState('denied');
    }
  };

  const handleFavoriteToggle = async (animalId: string) => {
    const animal = animals.find(a => a.id === animalId);
    if (!animal) return;

    const wasFavorite = animal.isFavorite;

    setAnimals(prev =>
      prev.map(a => {
        if (a.id === animalId) {
          return { ...a, isFavorite: !wasFavorite };
        }
        return a;
      })
    );

    try {
      if (wasFavorite) {
        const favId = favoriteIds[animalId];
        if (favId) {
          await animalService.removeFavorite(favId);
          setFavoriteIds(prev => {
            const next = { ...prev };
            delete next[animalId];
            return next;
          });
        }
      } else {
        const favRecord = await animalService.addFavorite(animalId);
        setFavoriteIds(prev => ({ ...prev, [animalId]: favRecord.id }));
      }
    } catch (error: any) {
      console.warn('Error toggling favorite:', error.response?.data || error.message);

      const isAlreadyDeleted = wasFavorite && (error.response?.status === 404 || error.response?.data?.error === "NOT_FOUND");

      if (!isAlreadyDeleted) {
        setAnimals(prev =>
          prev.map(a => {
            if (a.id === animalId) {
              return { ...a, isFavorite: wasFavorite };
            }
            return a;
          })
        );
      } else {
        // Si ya fue eliminado en el servidor, limpiamos el estado local
        setFavoriteIds(prev => {
          const next = { ...prev };
          delete next[animalId];
          return next;
        });
      }
    }
  };

  const syncFavorites = useCallback(async () => {
    if (!userId || animals.length === 0) return;

    try {
      const userFavs = await animalService.getUserFavorites(userId);
      const favMap: Record<string, string> = {};
      (userFavs || []).forEach((fav: any) => {
        favMap[fav.id] = fav.favoriteId;
      });

      setFavoriteIds(favMap);
      setAnimals(prev =>
        prev.map(a => ({
          ...a,
          isFavorite: !!favMap[a.id]
        }))
      );
    } catch (error) {
      console.warn('Error syncing favorites on focus:', error);
    }
  }, [userId, animals.length]);

  return {
    isFilterSheetVisible,
    locationState,
    userCoords,
    animals,
    loadingAnimals,
    favoriteIds,
    openFilterSheet,
    closeFilterSheet,
    handleSearchSubmit,
    handleApplyFilters,
    handleEnableLocation,
    handleFavoriteToggle,
    syncFavorites,
  };
};
