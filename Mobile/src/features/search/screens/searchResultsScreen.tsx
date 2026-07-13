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
import MapView, { Marker, UrlTile, Circle as MapCircle } from 'react-native-maps';
import Svg, { Circle, Polygon, Path, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { SearchBar } from '../../../shared/components/ui/SearchBar';
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
import { translateCategory, translateGender, formatAge, formatDistance } from '../../../shared/utils/translations';

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

interface CustomMarkerPinProps {
    isSelected: boolean;
}

function CustomMarkerPin({ isSelected }: CustomMarkerPinProps) {
    const strokeColor = isSelected ? theme.colors.secondary : theme.colors.primary;
    return (
        <Svg width={42} height={42} viewBox="0 0 42 42" style={{ width: 42, height: 42 }}>
            <Defs>
                <LinearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="#F19C2B" />
                    <Stop offset="1" stopColor="#FF9200" />
                </LinearGradient>
            </Defs>
            
            {/* Arrow/Triangle pointing down */}
            <Polygon
                points="16,31 26,31 21,41"
                fill={strokeColor}
            />
            
            {/* Outer Circle (White Background with Border) */}
            <Circle
                cx="21"
                cy="18"
                r="16"
                fill="#FFFFFF"
                stroke={strokeColor}
                strokeWidth="2"
            />
            
            {/* Inner Orange Circle */}
            <Circle
                cx="21"
                cy="18"
                r="12"
                fill="url(#orangeGradient)"
            />
            
            {/* Paw Print paths (scaled by 0.7 and centered at 21,18) */}
            <G transform="translate(21, 18) scale(0.7) translate(-20, -20)">
                <Path d="M22.0479 16.0796C22.4162 16.2723 22.7503 16.3132 23.0576 16.2358L23.1875 16.1958C23.4686 16.0923 23.8807 15.8426 24.1426 15.6108C24.8513 14.9858 25.3795 13.9995 25.5791 12.856C25.6474 12.463 25.6638 12.2775 25.6621 11.8325V11.8306C25.6621 10.9732 25.5458 10.3913 25.3145 9.89307C24.95 9.10995 24.4052 8.65793 23.8135 8.52588C23.7506 8.51245 23.6455 8.50187 23.5293 8.50049C23.4118 8.49911 23.3273 8.50812 23.2939 8.51514C22.215 8.78035 21.3003 9.72674 20.8418 11.272V11.2729C20.6279 11.9935 20.5362 12.8878 20.6035 13.5132V13.5142C20.7394 14.7903 21.3089 15.6935 22.0479 16.0796Z" fill="white" />
                <Path d="M16.1328 16.2861C16.3457 16.2949 16.4769 16.2746 16.6504 16.2168C16.9347 16.1222 17.1646 15.977 17.3916 15.7412C17.7894 15.3279 18.0801 14.7025 18.1963 13.9219L18.2354 13.5781C18.2639 13.2037 18.2309 12.6196 18.1494 12.165V12.1641C17.8176 10.2876 16.8043 9.01791 15.5869 8.65234C15.3619 8.58597 15.1426 8.57317 14.9561 8.60645H14.957C14.4378 8.70062 13.8704 9.15044 13.5137 9.89648V9.89746C13.3273 10.2863 13.2332 10.663 13.1895 11.2969V11.2988L13.1807 11.5264C13.1767 11.7759 13.188 12.0771 13.21 12.2803C13.3832 13.8668 14.0898 15.149 15.0938 15.8477H15.0947C15.2887 15.983 15.6284 16.1575 15.8418 16.2314C15.9304 16.2621 15.9576 16.2698 15.9775 16.2734C16.0001 16.2775 16.0315 16.2804 16.1338 16.2852L16.1328 16.2861Z" fill="white" />
                <Path d="M27.3008 22.3223H27.3018C27.9845 22.2604 28.6108 21.9435 29.1953 21.3164C29.8411 20.622 30.2968 19.6459 30.4453 18.6123V18.6113C30.4732 18.422 30.4953 18.0823 30.5 17.8457L30.498 17.6533C30.4387 16.6188 29.9075 15.8009 29.291 15.5254C29.0486 15.4179 28.7925 15.3857 28.5771 15.4219H28.5781C27.6305 15.5838 26.7557 16.2369 26.1572 17.3184L26.042 17.54C25.8018 18.0288 25.6663 18.4315 25.5625 19.0127L25.5195 19.2744C25.4825 19.5222 25.4766 19.602 25.4766 19.8975C25.4766 20.164 25.4865 20.316 25.5195 20.4883L25.5605 20.6729C25.7427 21.415 26.159 21.9563 26.5996 22.1777C26.8548 22.3059 27.0635 22.3444 27.3008 22.3223Z" fill="white" />
                <Path d="M11.4893 22.6396C12.0234 22.7883 12.488 22.6626 12.9219 22.2119C13.295 21.8243 13.5205 21.2206 13.5205 20.3154C13.5205 19.9605 13.5052 19.781 13.4463 19.458V19.457C13.2592 18.4189 12.713 17.4234 11.9717 16.7383L11.8213 16.6055C11.4339 16.2807 10.9355 16.0065 10.6787 15.9404H10.6777C10.4654 15.8853 10.183 15.8739 9.97363 15.9102H9.97461C9.37353 16.015 8.86666 16.4534 8.68164 17.0254V17.0264L8.62891 17.2129C8.59538 17.3489 8.5655 17.506 8.54297 17.666L8.51562 17.9062C8.42209 18.9585 8.75344 20.1598 9.39258 21.083L9.52441 21.2637C10.0617 21.9614 10.7423 22.4305 11.4893 22.6396Z" fill="white" />
                <Path d="M24.4971 30.3833C25.6272 30.7158 26.6056 30.2765 26.916 29.562C27.0504 29.2488 27.0878 28.6424 26.9404 28.0142C26.8149 27.4819 26.4588 26.6193 26.085 25.9438L25.9238 25.6675C24.6666 23.6109 23.7958 22.5129 22.8115 21.687C21.8839 20.9101 21.1477 20.573 20.252 20.4692H20.251C20.0659 20.4475 19.7502 20.4417 19.4971 20.4526L19.2725 20.4692C18.7011 20.5358 18.1331 20.6942 17.5693 20.9517H17.5703C16.8174 21.2976 16.0875 21.8467 15.5635 22.4487L15.3516 22.7095C14.2092 24.2318 13.4061 25.8579 13.0332 27.3589L12.9639 27.6577L12.876 28.0278C12.7814 28.3842 12.7959 28.798 12.9199 29.1548C13.0997 29.6725 13.4583 30.0748 13.8926 30.2886L14.083 30.3687C14.3615 30.4653 14.8586 30.4808 15.4873 30.3442H15.4893C15.8843 30.2598 16.1801 30.1646 17.1045 29.8091V29.8081C18.2525 29.3646 18.7062 29.2231 19.4258 29.1343L19.7529 29.0991C20.1577 29.0602 20.2589 29.0571 20.5645 29.0806C21.3276 29.1368 21.9269 29.3143 22.9873 29.7642C23.4467 29.959 23.803 30.1085 24.0596 30.2134C24.1879 30.2659 24.29 30.3061 24.3662 30.3354C24.404 30.35 24.434 30.3614 24.457 30.3696C24.4685 30.3737 24.4777 30.3772 24.4844 30.3794C24.4908 30.3815 24.4939 30.3823 24.4941 30.3823L24.4971 30.3833Z" fill="white" />
            </G>
        </Svg>
    );
}

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
    <TouchableOpacity activeOpacity={0.85} style={styles.filterBadge} onPress={() => {}}>
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
                        const details = [type, gender, age].filter(Boolean).join(' · ');
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
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    ...mapCenter,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                mapType="none" // Disable native tiles to show CARTO Voyager tiles
                onPress={() => {
                    setSelectedAnimal(null);
                }}
            >
                <UrlTile
                    urlTemplate="https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
                    maximumZ={19}
                    tileSize={256}
                />

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
                                <CustomMarkerPin isSelected={isSelected} />
                            </View>
                        </Marker>
                    );
                })}
            </MapView>

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
                            {translateCategory(selectedAnimal.type)} · {translateGender(selectedAnimal.gender)}
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
        alignItems: 'center',
        paddingHorizontal: 20,
        gap: 16,
    },
petCard: {
    width: '100%',
    maxWidth: 420,
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
