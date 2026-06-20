import React, { useMemo, useState, useRef, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Image, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { SearchBar } from '../../../shared/components/ui/SearchBar';
import { SearchFilterChip } from '../components/searchFilterChip';
import { FilterBottomSheet } from '../../home/components/FilterBottomSheet';
import { animalMocks, animalSearchMocks } from '../../../mocks/animalsMocks';
import { theme } from '../../../theme';
import MarkerIcon from '../../../assets/icons/buttons/marker.svg';
import { Animal } from '../../../../../Shared/types/animal';

interface FilterOption {
    id: string;
    label: string;
}

export function SearchResultsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const mapRef = useRef<MapView>(null);

    const [isFilterSheetVisible, setIsFilterSheetVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
    const [hiddenMarkerId, setHiddenMarkerId] = useState<string | null>(null);
    const [activeFilters, setActiveFilters] = useState<FilterOption[]>([
        { id: 'type', label: 'Perros' },
        { id: 'location', label: 'La Plata' },
    ]);

    // Merge animalMocks and animalSearchMocks to have all mock data available with coordinates
    const allAnimals = useMemo(() => {
        const merged = [...animalSearchMocks];
        animalMocks.forEach((animal) => {
            if (!merged.some((a) => a.id === animal.id)) {
                merged.push(animal);
            }
        });
        return merged;
    }, []);

    // Filter animals based on searchText and activeFilters
    const filteredAnimals = useMemo(() => {
        return allAnimals.filter((animal) => {
            // Text Search filter
            if (searchText) {
                const searchLower = searchText.toLowerCase();
                const matchName = animal.name.toLowerCase().includes(searchLower);
                const matchType = animal.type.toLowerCase().includes(searchLower);
                const matchAge = animal.age.toLowerCase().includes(searchLower);
                const matchGender = animal.gender.toLowerCase().includes(searchLower);
                if (!matchName && !matchType && !matchAge && !matchGender) {
                    return false;
                }
            }

            // Category/Type filter
            const typeFilter = activeFilters.find((f) => f.id === 'type');
            if (typeFilter) {
                const filterLabel = typeFilter.label.toLowerCase();
                const animalType = animal.type.toLowerCase();
                if (filterLabel.startsWith('perro') && !animalType.startsWith('perro')) return false;
                if (filterLabel.startsWith('gato') && !animalType.startsWith('gato')) return false;
                if (!filterLabel.startsWith('perro') && !filterLabel.startsWith('gato') && !animalType.includes(filterLabel)) {
                    return false;
                }
            }

            // Location filter
            const locationFilter = activeFilters.find((f) => f.id === 'location');
            if (locationFilter) {
                const filterLabel = locationFilter.label.toLowerCase();
                if (filterLabel !== 'la plata' && !animal.distanceKm.toString().includes(filterLabel)) {
                    return false;
                }
            }

            // Size filter
            const sizeFilter = activeFilters.find((f) => f.id === 'size');
            if (sizeFilter) {
                const filterLabel = sizeFilter.label.toLowerCase();
                if (filterLabel === 'pequeño' && animal.weightKg > 10) return false;
                if (filterLabel === 'grande' && animal.weightKg < 20) return false;
                if (filterLabel === 'mediano' && (animal.weightKg <= 10 || animal.weightKg >= 20)) return false;
            }

            return true;
        });
    }, [allAnimals, searchText, activeFilters]);

    // Fit map coordinates when filtered animals list changes
    useEffect(() => {
        let timer: NodeJS.Timeout | undefined;
        if (filteredAnimals.length > 0 && mapRef.current) {
            const coordinates = filteredAnimals
                .filter((a) => a.latitude !== undefined && a.longitude !== undefined)
                .map((a) => ({
                    latitude: a.latitude!,
                    longitude: a.longitude!,
                }));

            if (coordinates.length > 0) {
                timer = setTimeout(() => {
                    mapRef.current?.fitToCoordinates(coordinates, {
                        edgePadding: { top: 180, right: 60, bottom: 120, left: 60 },
                        animated: true,
                    });
                }, 500);
            }
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [filteredAnimals]);

    // When the selected animal is filtered out, clear selection
    useEffect(() => {
        if (selectedAnimal && !filteredAnimals.some((a) => a.id === selectedAnimal.id)) {
            setSelectedAnimal(null);
        }
    }, [filteredAnimals, selectedAnimal]);

    const handleCloseCard = (animalId: string) => {
        setSelectedAnimal(null);
        setHiddenMarkerId(animalId);
        setTimeout(() => {
            setHiddenMarkerId(null);
        }, 500);
    };

    const handleRemoveFilter = (filterId: string) => {
        setActiveFilters((current) => current.filter((f) => f.id !== filterId));
    };

    const handleApplyFilters = (values: { category: string; size: string; location: string }) => {
        const newFilters: FilterOption[] = [];
        if (values.category) {
            newFilters.push({ id: 'type', label: values.category === 'Perro' ? 'Perros' : values.category === 'Gato' ? 'Gatos' : values.category });
        }
        if (values.location) {
            newFilters.push({ id: 'location', label: values.location });
        }
        if (values.size) {
            newFilters.push({ id: 'size', label: values.size });
        }
        setActiveFilters(newFilters);
    };

    return (
        <View style={styles.container}>
            {/* Map Background */}
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: -34.9214,
                    longitude: -57.9544,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                mapType="none" // Disable native tiles to show OpenStreetMap
                onPress={() => {
                    if (selectedAnimal) {
                        handleCloseCard(selectedAnimal.id);
                    }
                }}
            >
                <UrlTile
                    urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maximumZ={19}
                    tileSize={256}
                />

                {filteredAnimals.map((animal) => {
                    if (animal.latitude === undefined || animal.longitude === undefined) return null;
                    if (hiddenMarkerId === animal.id) return null;
                    const isSelected = selectedAnimal?.id === animal.id;
                    return (
                        <Marker
                            key={animal.id}
                            coordinate={{
                                latitude: animal.latitude,
                                longitude: animal.longitude,
                            }}
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
                                {isSelected && (
                                    <View style={styles.inlineCard}>
                                        <Image
                                            source={{ uri: animal.photoUri }}
                                            style={styles.inlineCardImage}
                                        />
                                        <View style={styles.inlineCardDetails}>
                                            <View style={styles.inlineCardHeader}>
                                                <Text numberOfLines={1} style={styles.inlineCardName}>
                                                    {animal.name}
                                                </Text>
                                                <TouchableOpacity
                                                    onPress={(evt) => {
                                                        evt.stopPropagation();
                                                        handleCloseCard(animal.id);
                                                    }}
                                                    style={styles.closeCardBtn}
                                                >
                                                    <Text style={styles.closeCardText}>×</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <Text numberOfLines={1} style={styles.inlineCardInfo}>
                                                {animal.type} · {animal.gender}
                                            </Text>
                                            <Text numberOfLines={1} style={styles.inlineCardMeta}>
                                                {animal.age} · {animal.weightKg} kg
                                            </Text>
                                        </View>
                                    </View>
                                )}
                                <View style={styles.markerPin}>
                                    <View style={[styles.markerBubble, isSelected && styles.markerBubbleSelected]}>
                                        <MarkerIcon width={30} height={30} />
                                    </View>
                                    <View style={[styles.markerArrow, isSelected && styles.markerArrowSelected]} />
                                </View>
                            </View>
                        </Marker>
                    );
                })}
            </MapView>

            {/* Floating Top Panel */}
            <View style={[styles.floatingOverlay, { paddingTop: insets.top + 16 }]}>
                <SearchBar
                    value={searchText}
                    onChangeText={setSearchText}
                    onFilterPress={() => setIsFilterSheetVisible(true)}
                />

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filtersContainer}
                    style={styles.filtersScroll}
                >
                    {activeFilters.map((filter) => (
                        <SearchFilterChip
                            key={filter.id}
                            label={filter.label}
                            onRemove={() => handleRemoveFilter(filter.id)}
                        />
                    ))}
                </ScrollView>
            </View>

            {/* Bottom Filter Sheet */}
            <FilterBottomSheet
                visible={isFilterSheetVisible}
                onClose={() => setIsFilterSheetVisible(false)}
                onApply={handleApplyFilters}
                onClear={() => setActiveFilters([])}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    filtersScroll: {
        marginTop: 12,
        flexGrow: 0,
    },
    filtersContainer: {
        flexDirection: 'row',
        gap: 8,
        paddingRight: 4,
        paddingBottom: 8, // padding for shadow visibility
    },
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    markerPin: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    markerBubble: {
        backgroundColor: theme.colors.white,
        borderRadius: 24,
        padding: 4,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 5,
    },
    markerBubbleSelected: {
        borderColor: theme.colors.secondary,
        transform: [{ scale: 1.1 }],
    },
    markerArrow: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderTopWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: theme.colors.primary,
        marginTop: -2,
    },
    markerArrowSelected: {
        borderTopColor: theme.colors.secondary,
        transform: [{ scale: 1.1 }],
    },
    inlineCard: {
        position: 'absolute',
        bottom: 56, // sits right above the pin bubble
        width: 170,
        backgroundColor: theme.colors.white,
        borderRadius: 12,
        padding: 8,
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
        width: 44,
        height: 44,
        borderRadius: 8,
        backgroundColor: theme.colors.gray100,
    },
    inlineCardDetails: {
        flex: 1,
        marginLeft: 8,
        justifyContent: 'center',
    },
    inlineCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    inlineCardName: {
        fontSize: 13,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.textPrimary,
        lineHeight: 16,
    },
    closeCardBtn: {
        paddingHorizontal: 4,
    },
    closeCardText: {
        fontSize: 18,
        color: theme.colors.gray500,
        lineHeight: 18,
        fontWeight: 'bold',
    },
    inlineCardInfo: {
        fontSize: 10,
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.textSecondary,
        marginTop: 1,
        lineHeight: 12,
    },
    inlineCardMeta: {
        fontSize: 9,
        fontFamily: theme.typography.fontFamily.medium,
        color: theme.colors.primary,
        marginTop: 2,
        lineHeight: 11,
    },
});
