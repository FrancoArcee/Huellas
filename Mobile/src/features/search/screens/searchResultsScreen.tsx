import React, { useMemo, useState, useRef, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Image, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import Svg, { Circle, Polygon, Path, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { SearchBar } from '../../../shared/components/ui/SearchBar';
import { SearchFilterChip } from '../components/searchFilterChip';
import { FilterBottomSheet } from '../../home/components/FilterBottomSheet';
import { animalMocks, animalSearchMocks } from '../../../mocks/animalsMocks';
import { theme } from '../../../theme';
import { Animal } from '../../../../../Shared/types/animal';

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
                mapType="none" // Disable native tiles to show CARTO Voyager tiles
                onPress={() => {
                    if (selectedAnimal) {
                        handleCloseCard(selectedAnimal.id);
                    }
                }}
            >
                <UrlTile
                    urlTemplate="https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
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

            {/* Floating Bottom Card */}
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
                            {selectedAnimal.type} · {selectedAnimal.gender}
                        </Text>
                        <Text numberOfLines={1} style={styles.inlineCardMeta}>
                            {selectedAnimal.age} · {selectedAnimal.weightKg} kg
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
