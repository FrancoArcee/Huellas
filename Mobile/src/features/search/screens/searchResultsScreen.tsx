import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import type MapView from 'react-native-maps';
import { Marker, Circle as MapCircle } from 'react-native-maps';
import Svg, { Path } from 'react-native-svg';
import { SearchBar } from '../../../shared/components/ui/SearchBar';
import { AppMap } from '../../../shared/components/ui/AppMap';
import { PawMarkerPin } from '../../../shared/components/ui/PawMarkerPin';
import {
    FilterBottomSheet,
    NO_RADIUS,
    agePresets,
    weightPresets,
    type FilterValues,
} from '../../home/components/FilterBottomSheet';
import { PetHorizontalCard } from '../../../shared/components/ui/PetHorizontalCard';
import { theme } from '../../../theme';
import { useAuthStore } from '../../../shared/store/authStore';
import { storage } from '../../../shared/services/storage';
import { getDistanceKm } from '../../../shared/utils/distance';
import { AnimalDTO } from '../schemas/animalSchema';
import { FetchAnimalsParams, fetchAnimals } from '../services/animalsService';
import { animalService } from '../../animals/services/animalService';
import { translateCategory, translateGender, formatAge, formatDistance, translateStatus, getStatusColors } from '../../../shared/utils/translations';

type FilterOption = { id: string; label: string };
type LayoutMode = 'list' | 'map';

const categoryLabels: Record<string, string> = {
    dog: 'Perros',
    cat: 'Gatos',
    other: 'Otros',
};

const sizeLabels: Record<string, string> = {
    small: 'Pequeño',
    medium: 'Mediano',
    large: 'Grande',
};

const genderLabels: Record<string, string> = {
    male: 'Macho',
    female: 'Hembra',
};

const rangeLabel = (
    presets: { label: string; chip?: string; min?: number; max?: number }[],
    min: number | undefined,
    max: number | undefined,
    fallback: string,
) => {
    const preset = presets.find((p) => p.min === min && p.max === max);
    return preset?.chip ?? preset?.label ?? fallback;
};

const getParamValue = (value: string | string[] | undefined) => {
    if (Array.isArray(value)) return value[0] ?? '';
    return value ?? '';
};

const getNumericParam = (value: string | string[] | undefined): number | undefined => {
    const raw = getParamValue(value);
    if (!raw) return undefined;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : undefined;
};

const buildFilters = (params: FetchAnimalsParams): FilterOption[] => {
    const filters: FilterOption[] = [];
    if (params.search) filters.push({ id: 'search', label: `"${params.search}"` });
    if (params.category) filters.push({ id: 'category', label: categoryLabels[params.category] ?? params.category });
    if (params.location) filters.push({ id: 'location', label: (params.location.split(',')[0] ?? params.location).trim() });
    if (params.size) filters.push({ id: 'size', label: sizeLabels[params.size] ?? params.size });
    if (params.gender) filters.push({ id: 'gender', label: genderLabels[params.gender] ?? params.gender });
    if (params.minAge !== undefined || params.maxAge !== undefined) {
        filters.push({
            id: 'age',
            label: rangeLabel(agePresets, params.minAge, params.maxAge, `Edad ${params.minAge ?? 0}-${params.maxAge ?? '∞'}`),
        });
    }
    if (params.minWeight !== undefined || params.maxWeight !== undefined) {
        filters.push({
            id: 'weight',
            label: rangeLabel(weightPresets, params.minWeight, params.maxWeight, `Peso ${params.minWeight ?? 0}-${params.maxWeight ?? '∞'} kg`),
        });
    }
    if (params.radius !== undefined) filters.push({ id: 'radius', label: `Hasta ${params.radius} km` });
    return filters;
};

const AppliedFilterBadge = ({
    label,
    onRemove,
}: {
    label: string;
    onRemove: () => void;
}) => (
    <TouchableOpacity activeOpacity={0.85} style={styles.filterBadge} onPress={() => { }}>
        <Text numberOfLines={1} style={styles.filterBadgeText}>
            {label}
        </Text>
        <TouchableOpacity activeOpacity={0.7} onPress={onRemove} style={styles.filterBadgeRemoveBtn}>
            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                <Path d="M18 6L6 18M6 6l12 12" stroke={theme.colors.textPrimary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
        </TouchableOpacity>
    </TouchableOpacity>
);

export function SearchResultsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const mapRef = useRef<MapView>(null);
    const currentUserId = useAuthStore((state) => state.user?.id);
    const params = useLocalSearchParams<{
        search?: string;
        category?: string;
        size?: string;
        gender?: string;
        location?: string;
        placeId?: string;
        latitude?: string;
        longitude?: string;
        radius?: string;
        minAge?: string;
        maxAge?: string;
        minWeight?: string;
        maxWeight?: string;
        layout?: string;
    }>();

    const initialSearch = getParamValue(params.search);
    const initialCategory = getParamValue(params.category);
    const initialSize = getParamValue(params.size);
    const initialGender = getParamValue(params.gender);
    const initialLocation = getParamValue(params.location);
    const initialPlaceId = getParamValue(params.placeId);
    const initialLatitude = getNumericParam(params.latitude);
    const initialLongitude = getNumericParam(params.longitude);
    const initialRadius = getNumericParam(params.radius);
    const initialMinAge = getNumericParam(params.minAge);
    const initialMaxAge = getNumericParam(params.maxAge);
    const initialMinWeight = getNumericParam(params.minWeight);
    const initialMaxWeight = getNumericParam(params.maxWeight);
    const initialLayout = getParamValue(params.layout);
    const initialFetchParams = useMemo<FetchAnimalsParams>(() => ({
        search: initialSearch,
        category: initialCategory,
        size: initialSize,
        gender: initialGender,
        location: initialLocation,
        ...(initialPlaceId ? { placeId: initialPlaceId } : {}),
        ...(initialLatitude !== undefined ? { latitude: initialLatitude } : {}),
        ...(initialLongitude !== undefined ? { longitude: initialLongitude } : {}),
        ...(initialRadius !== undefined ? { radius: initialRadius } : {}),
        ...(initialMinAge !== undefined ? { minAge: initialMinAge } : {}),
        ...(initialMaxAge !== undefined ? { maxAge: initialMaxAge } : {}),
        ...(initialMinWeight !== undefined ? { minWeight: initialMinWeight } : {}),
        ...(initialMaxWeight !== undefined ? { maxWeight: initialMaxWeight } : {}),
    }), [
        initialCategory,
        initialGender,
        initialLatitude,
        initialLocation,
        initialLongitude,
        initialMaxAge,
        initialMaxWeight,
        initialMinAge,
        initialMinWeight,
        initialPlaceId,
        initialRadius,
        initialSearch,
        initialSize,
    ]);

    const [isFilterSheetVisible, setIsFilterSheetVisible] = useState(false);
    const [searchText, setSearchText] = useState(initialSearch);
    const [layoutMode, setLayoutMode] = useState<LayoutMode>(
        initialSearch || initialLayout === 'list' ? 'list' : 'map',
    );
    const [animals, setAnimals] = useState<AnimalDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAnimal, setSelectedAnimal] = useState<AnimalDTO | null>(null);
    const [hiddenMarkerId, setHiddenMarkerId] = useState<string | null>(null);
    const [fetchParams, setFetchParams] = useState<FetchAnimalsParams>(initialFetchParams);
    const [userCoords, setUserCoords] = useState<
        { latitude: number; longitude: number } | null | undefined
    >(undefined);
    const [favoriteIds, setFavoriteIds] = useState<Record<string, string>>({});

    const mapAnimals = useMemo(
        () => animals.filter((animal) => animal.latitude !== undefined && animal.longitude !== undefined),
        [animals],
    );

    const mapCenter = useMemo(() => {
        if (fetchParams.latitude !== undefined && fetchParams.longitude !== undefined) {
            return { latitude: fetchParams.latitude, longitude: fetchParams.longitude };
        }
        if (userCoords) return userCoords;
        return { latitude: -34.9214, longitude: -57.9544 };
    }, [fetchParams.latitude, fetchParams.longitude, userCoords]);

    const activeFilters = useMemo(() => buildFilters(fetchParams), [fetchParams]);

    useEffect(() => {
        setSearchText(initialSearch);
        setLayoutMode(initialSearch || initialLayout === 'list' ? 'list' : 'map');
        setSelectedAnimal(null);
        setFetchParams(initialFetchParams);
    }, [initialFetchParams, initialLayout, initialSearch]);

    const loadAnimals = useCallback(async () => {
        const hasFilterCoordinates =
            fetchParams.latitude !== undefined && fetchParams.longitude !== undefined;
        if (!hasFilterCoordinates && userCoords === undefined) return;

        setLoading(true);
        try {
            const nextAnimals = await fetchAnimals({ ...fetchParams, limit: 100 });
            const filtered = nextAnimals.filter((a) => a.userId !== currentUserId);

            const lat = fetchParams.latitude ?? userCoords?.latitude;
            const lng = fetchParams.longitude ?? userCoords?.longitude;

            const withDistance = filtered.map((a) => {
                if (lat !== undefined && lng !== undefined && a.latitude !== undefined && a.longitude !== undefined) {
                    const dist = getDistanceKm(lat, lng, a.latitude, a.longitude);
                    return { ...a, distanceKm: dist };
                }
                return a;
            });

            setAnimals(withDistance);

            // Favoritos en segundo plano: no bloquean el render de resultados
            if (currentUserId) {
                void (async () => {
                    try {
                        const favMap: Record<string, string> = {};
                        await Promise.all(
                            withDistance.map(async (animal) => {
                                try {
                                    const fav = await animalService.checkFavorite(animal.id);
                                    if (fav) {
                                        favMap[animal.id] = fav.id;
                                    }
                                } catch {}
                            })
                        );
                        setFavoriteIds(favMap);
                    } catch (error) {
                        console.warn('Error checking favorites:', error);
                    }
                })();
            }
        } catch (error) {
            console.warn('Error loading animals', error);
            setAnimals([]);
        } finally {
            setLoading(false);
        }
    }, [fetchParams, currentUserId, userCoords]);

    useEffect(() => {
        loadAnimals();
    }, [loadAnimals]);

    const handleFavoriteToggle = async (animalId: string) => {
        const animal = animals.find(a => a.id === animalId);
        if (!animal) return;

        const wasFavorite = !!favoriteIds[animalId];

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
                setFavoriteIds(prev => {
                    const next = { ...prev };
                    delete next[animalId];
                    return next;
                });
            }
        }
    };

    useEffect(() => {
        const loadLocation = async () => {
            const savedCoords = await storage.getLocationCoords();

            try {
                let permission = await Location.getForegroundPermissionsAsync();
                if (permission.status === 'undetermined') {
                    permission = await Location.requestForegroundPermissionsAsync();
                }

                if (permission.status === 'granted') {
                    const location = await Location.getCurrentPositionAsync({
                        accuracy: Location.Accuracy.Balanced,
                    });
                    const currentCoords = {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    };

                    await storage.setLocation(currentCoords.latitude, currentCoords.longitude);
                    setUserCoords(currentCoords);
                    return;
                }
            } catch (error) {
                console.warn('Error getting current location for distances', error);
            }

            setUserCoords(savedCoords);
        };

        if (fetchParams.latitude === undefined || fetchParams.longitude === undefined) {
            loadLocation();
        }
    }, [fetchParams.latitude, fetchParams.longitude]);

    // Fit map coordinates when filtered animals list changes
    useEffect(() => {
        let timer: NodeJS.Timeout | undefined;
        if (layoutMode !== 'map' || !mapRef.current) return;

        if (mapAnimals.length > 0) {
            const coordinates = mapAnimals.map((a) => ({
                latitude: a.latitude!,
                longitude: a.longitude!,
            }));

            timer = setTimeout(() => {
                mapRef.current?.fitToCoordinates(coordinates, {
                    edgePadding: { top: 180, right: 60, bottom: 120, left: 60 },
                    animated: true,
                });
            }, 500);
        } else {
            // Sin resultados: centrar en el área del filtro (o la referencia disponible)
            const radiusKm = fetchParams.radius ?? 25;
            const delta = Math.max((radiusKm * 2.4) / 111, 0.05);
            timer = setTimeout(() => {
                mapRef.current?.animateToRegion(
                    {
                        ...mapCenter,
                        latitudeDelta: delta,
                        longitudeDelta: delta,
                    },
                    400,
                );
            }, 500);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [layoutMode, mapAnimals, mapCenter, fetchParams.radius]);

    useEffect(() => {
        if (selectedAnimal && !animals.some((a) => a.id === selectedAnimal.id)) {
            setSelectedAnimal(null);
        }
    }, [animals, selectedAnimal]);

    const handleCloseCard = (animalId: string) => {
        setSelectedAnimal(null);
        setHiddenMarkerId(animalId);
        setTimeout(() => {
            setHiddenMarkerId(null);
        }, 500);
    };

    const handleSearchSubmit = (search: string) => {
        setLayoutMode('list');
        setSearchText(search);
        setSelectedAnimal(null);
        setFetchParams((current) => ({ ...current, search }));
    };

    const handleRemoveFilter = (filterId: string) => {
        if (filterId === 'search') {
            setSearchText('');
        }
        setFetchParams((current) => {
            if (filterId === 'location') {
                const {
                    location: _location,
                    placeId: _placeId,
                    latitude: _latitude,
                    longitude: _longitude,
                    radius: _radius,
                    ...rest
                } = current;
                return rest;
            }
            if (filterId === 'radius') {
                const { radius: _radius, ...rest } = current;
                return rest;
            }
            if (filterId === 'age') {
                const { minAge: _minAge, maxAge: _maxAge, ...rest } = current;
                return rest;
            }
            if (filterId === 'weight') {
                const { minWeight: _minWeight, maxWeight: _maxWeight, ...rest } = current;
                return rest;
            }
            return { ...current, [filterId]: undefined };
        });
    };

    const handleApplyFilters = (values: FilterValues) => {
        // Centro del geo-filtro: localidad elegida > ubicación del usuario.
        const hasPlace = values.latitude !== undefined && values.longitude !== undefined;
        const center = hasPlace
            ? { latitude: values.latitude!, longitude: values.longitude! }
            : userCoords ?? undefined;
        const radius = values.radius !== NO_RADIUS && center ? values.radius : undefined;

        const nextParams: FetchAnimalsParams = {
            search: searchText,
            category: values.category,
            location: values.location,
            ...(values.placeId ? { placeId: values.placeId } : {}),
            size: values.size,
            gender: values.gender,
            ...(center !== undefined
                ? { latitude: center.latitude, longitude: center.longitude }
                : {}),
            ...(radius !== undefined ? { radius } : {}),
            ...(values.minAge !== undefined ? { minAge: values.minAge } : {}),
            ...(values.maxAge !== undefined ? { maxAge: values.maxAge } : {}),
            ...(values.minWeight !== undefined ? { minWeight: values.minWeight } : {}),
            ...(values.maxWeight !== undefined ? { maxWeight: values.maxWeight } : {}),
        };
        setLayoutMode('map');
        setSelectedAnimal(null);
        setFetchParams(nextParams);
    };

    const handleClearFilters = () => {
        setFetchParams({ search: searchText });
    };

    const renderFloatingOverlay = () => (
        <View style={[styles.floatingOverlay, { paddingTop: insets.top + 16 }]}>
            <SearchBar
                value={searchText}
                onChangeText={setSearchText}
                onSubmit={handleSearchSubmit}
                onFilterPress={() => setIsFilterSheetVisible(true)}
            />

            <View style={styles.overlayActions}>
                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => {
                        setSelectedAnimal(null);
                        setLayoutMode((current) => (current === 'list' ? 'map' : 'list'));
                    }}
                    style={styles.layoutToggle}
                >
                    <Text style={styles.layoutToggleText}>
                        {layoutMode === 'list' ? 'Ver mapa' : 'Ver lista'}
                    </Text>
                </TouchableOpacity>

                <View style={styles.resultsPill}>
                    {loading ? (
                        <ActivityIndicator size="small" color={theme.colors.primary} />
                    ) : (
                        <Text style={styles.resultsPillText}>
                            {animals.length === 1 ? '1 resultado' : `${animals.length} resultados`}
                        </Text>
                    )}
                </View>
            </View>

            {activeFilters.length > 0 && (
                <View style={styles.filtersContainer}>
                    {activeFilters.map((item) => (
                        <AppliedFilterBadge
                            key={item.id}
                            label={item.label}
                            onRemove={() => handleRemoveFilter(item.id)}
                        />
                    ))}
                </View>
            )}
        </View>
    );

    const renderFilterSheet = () => (
        <FilterBottomSheet
            visible={isFilterSheetVisible}
            onClose={() => setIsFilterSheetVisible(false)}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
            hasUserLocation={!!userCoords}
            initialValues={{
                category: fetchParams.category ?? '',
                size: fetchParams.size ?? '',
                gender: fetchParams.gender ?? '',
                location: fetchParams.location ?? '',
                radius: fetchParams.radius ?? NO_RADIUS,
                ...(fetchParams.location && fetchParams.placeId
                    ? { placeId: fetchParams.placeId }
                    : {}),
                ...(fetchParams.location && fetchParams.latitude !== undefined
                    ? { latitude: fetchParams.latitude }
                    : {}),
                ...(fetchParams.location && fetchParams.longitude !== undefined
                    ? { longitude: fetchParams.longitude }
                    : {}),
                ...(fetchParams.minAge !== undefined ? { minAge: fetchParams.minAge } : {}),
                ...(fetchParams.maxAge !== undefined ? { maxAge: fetchParams.maxAge } : {}),
                ...(fetchParams.minWeight !== undefined ? { minWeight: fetchParams.minWeight } : {}),
                ...(fetchParams.maxWeight !== undefined ? { maxWeight: fetchParams.maxWeight } : {}),
            }}
        />
    );

    if (loading && animals.length === 0) {
        return (
            <View style={styles.centeredContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (animals.length === 0 && layoutMode === 'list') {
        return (
            <View style={styles.container}>
                {renderFloatingOverlay()}
                <View style={styles.emptyState}>
                    <Text style={styles.emptyTitle}>No encontramos resultados</Text>
                    <Text style={styles.emptyText}>Probá con otros filtros o buscá de nuevo.</Text>
                    <TouchableOpacity activeOpacity={0.85} onPress={loadAnimals} style={styles.retryButton}>
                        <Text style={styles.retryButtonText}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
                {renderFilterSheet()}
            </View>
        );
    }

    if (layoutMode === 'list') {
        return (
            <View style={styles.container}>
                <FlatList
                    data={animals}
                    keyExtractor={(item) => item.id}
                    numColumns={1}
                    contentContainerStyle={[
                        styles.listContent,
                        { paddingTop: insets.top + 130, paddingBottom: insets.bottom + 24 },
                    ]}
                    renderItem={({ item }) => {
                        const type = translateCategory(item.type);
                        const gender = translateGender(item.gender);
                        const age = formatAge(parseInt(item.age, 10) || undefined);
                        const details = [type, age].filter(Boolean).join(' · ');
                        const hasReferenceCoordinates =
                            (fetchParams.latitude !== undefined &&
                                fetchParams.longitude !== undefined) ||
                            userCoords != null;
                        const distText = hasReferenceCoordinates
                            ? formatDistance(item.distanceKm)
                            : 'Distancia no disponible';
                        return (
                            <PetHorizontalCard
                                name={item.name}
                                details={details}
                                location={distText}
                                image={item.photoUri}
                                status={item.status}
                                tags={[gender, `${item.weightKg} KG`].filter(Boolean)}
                                isLiked={!!favoriteIds[item.id]}
                                onLikePress={() => handleFavoriteToggle(item.id)}
                                onPress={() => {
                                    router.push({
                                        pathname: '/animals/[id]',
                                        params: { id: item.id },
                                    });
                                }}
                                onButtonPress={() => {
                                    router.push({
                                        pathname: '/animals/[id]',
                                        params: { id: item.id },
                                    });
                                }}
                                style={styles.petCard}
                            />
                        );
                    }}
                />
                {renderFloatingOverlay()}
                {renderFilterSheet()}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <AppMap
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    ...mapCenter,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                onPress={() => {
                    setSelectedAnimal(null);
                }}
            >
                {fetchParams.radius !== undefined &&
                    fetchParams.latitude !== undefined &&
                    fetchParams.longitude !== undefined && (
                        <MapCircle
                            center={{
                                latitude: fetchParams.latitude,
                                longitude: fetchParams.longitude,
                            }}
                            radius={fetchParams.radius * 1000}
                            strokeColor="rgba(241, 156, 43, 0.55)"
                            fillColor="rgba(241, 156, 43, 0.10)"
                            strokeWidth={1.5}
                        />
                    )}

                {mapAnimals.map((animal) => {
                    if (hiddenMarkerId === animal.id) return null;
                    const isSelected = selectedAnimal?.id === animal.id;
                    return (
                        <Marker
                            key={animal.id}
                            coordinate={{
                                latitude: animal.latitude!,
                                longitude: animal.longitude!,
                            }}
                            anchor={{ x: 0.5, y: 0.976 }}
                            onPress={(e) => {
                                e.stopPropagation();
                                if (isSelected) {
                                    router.push({
                                        pathname: '/animals/[id]',
                                        params: { id: animal.id },
                                    });
                                } else {
                                    if (selectedAnimal) {
                                        handleCloseCard(selectedAnimal.id);
                                    }
                                    setSelectedAnimal(animal);
                                }
                            }}
                        >
                            <View style={styles.markerContainer}>
                                <PawMarkerPin isSelected={isSelected} />
                            </View>
                        </Marker>
                    );
                })}
            </AppMap>

            {renderFloatingOverlay()}
            {renderFilterSheet()}

            {selectedAnimal && (
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        router.push({
                            pathname: '/animals/[id]',
                            params: { id: selectedAnimal.id },
                        });
                    }}
                    style={[styles.inlineCard, { bottom: insets.bottom + 16 }]}
                >
                    <Image
                        source={{ uri: selectedAnimal.photoUri }}
                        style={styles.inlineCardImage}
                    />
                    <View style={styles.inlineCardDetails}>
                        <View style={styles.inlineCardHeader}>
                            <Text numberOfLines={1} style={styles.inlineCardName}>
                                {selectedAnimal.name}
                            </Text>
                            <TouchableOpacity
                                onPress={(evt) => {
                                    evt.stopPropagation();
                                    handleCloseCard(selectedAnimal.id);
                                }}
                                style={styles.closeCardBtn}
                            >
                                <Text style={styles.closeCardText}>×</Text>
                            </TouchableOpacity>
                        </View>
                        <Text numberOfLines={1} style={styles.inlineCardInfo}>
                            {translateCategory(selectedAnimal.type)} · {translateGender(selectedAnimal.gender)} · {translateStatus(selectedAnimal.status)}
                        </Text>
                        <Text numberOfLines={1} style={styles.inlineCardMeta}>
                            {formatAge(parseInt(selectedAnimal.age, 10) || undefined)} · {selectedAnimal.weightKg} kg
                        </Text>
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    centeredContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    floatingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        zIndex: 10,
    },
    overlayActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 12,
        height: 34,
    },
    filtersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 8,
        marginTop: 8,
    },
    layoutToggle: {
        height: 34,
        paddingHorizontal: 14,
        borderRadius: 17,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 3,
    },
    layoutToggleText: {
        color: theme.colors.white,
        fontSize: 12,
        fontFamily: theme.typography.fontFamily.semiBold,
    },
    resultsPill: {
        height: 34,
        minWidth: 60,
        paddingHorizontal: 12,
        borderRadius: 17,
        backgroundColor: theme.colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 2,
    },
    resultsPillText: {
        color: theme.colors.textPrimary,
        fontSize: 12,
        fontFamily: theme.typography.fontFamily.semiBold,
    },
    filterBadge: {
        height: 34,
        maxWidth: 132,
        paddingHorizontal: 12,
        borderRadius: 17,
        backgroundColor: theme.colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 2,
        elevation: 1,
    },
    filterBadgeText: {
        color: theme.colors.textPrimary,
        fontSize: 12,
        fontFamily: theme.typography.fontFamily.semiBold,
        flexShrink: 1,
    },
    filterBadgeRemoveBtn: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 6,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    emptyTitle: {
        fontSize: 18,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.textPrimary,
        textAlign: 'center',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: 18,
    },
    retryButton: {
        height: 42,
        paddingHorizontal: 18,
        borderRadius: 21,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    retryButtonText: {
        color: theme.colors.white,
        fontSize: 14,
        fontFamily: theme.typography.fontFamily.semiBold,
    },
    listContent: {
        gap: 16,
    },
    petCard: {
        width: '92%',
        maxWidth: 360,
        height: 175,
        alignSelf: 'center',
        marginBottom: 16,
    },

    markerContainer: {
        width: 42,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    inlineCard: {
        position: 'absolute',
        left: 20,
        right: 20,
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 6,
        borderWidth: 1,
        borderColor: theme.colors.gray200,
        zIndex: 100,
    },
    inlineCardImage: {
        width: 56,
        height: 56,
        borderRadius: 8,
        backgroundColor: theme.colors.gray100,
    },
    inlineCardDetails: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center',
    },
    inlineCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    inlineCardName: {
        fontSize: 15,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.textPrimary,
        lineHeight: 19,
    },
    closeCardBtn: {
        paddingHorizontal: 4,
    },
    closeCardText: {
        fontSize: 20,
        color: theme.colors.gray500,
        lineHeight: 20,
        fontWeight: 'bold',
    },
    inlineCardInfo: {
        fontSize: 12,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textSecondary,
        marginTop: 1,
        lineHeight: 15,
    },
    inlineCardMeta: {
        fontSize: 11,
        fontFamily: theme.typography.fontFamily.medium,
        color: theme.colors.primary,
        marginTop: 2,
        lineHeight: 14,
    },
});
