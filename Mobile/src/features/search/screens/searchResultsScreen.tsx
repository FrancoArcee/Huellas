import React, { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SearchBar } from '../../../shared/components/ui/SearchBar';
import { PetHorizontalCard } from '../../../shared/components/ui/PetHorizontalCard';
import { SearchFilterChip } from '../components/searchFilterChip';
import { animalSearchMocks } from '../.././../mocks/animalsMocks';
import ChevronBack from '../../../assets/icons/buttons/chevronBack.svg';
import { colors } from '../../../theme/index';
import { FilterBottomSheet } from '../../home/components/FilterBottomSheet';

interface FilterOption {
    id: string;
    label: string;
}

const FILTERS: FilterOption[] = [
    { id: 'type', label: 'Perros' },
    { id: 'location', label: 'La Plata' },
];

const searchPets = animalSearchMocks.map((animal) => ({
    id: animal.id,
    name: animal.name,
    details: `${animal.type} · ${animal.gender} · ${animal.age}`,
    location: `${animal.distanceKm} km`,
    image: animal.photoUri,
    tags: [animal.gender, `${animal.weightKg} KG`],
}));

export function SearchResultsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const initialLikes = useMemo(
        () => Object.fromEntries(searchPets.map((pet) => [pet.id, false])),
        [],
    );
    const [likedPets, setLikedPets] = useState<Record<string, boolean>>(initialLikes);
    const [isFilterSheetVisible, setIsFilterSheetVisible] = useState(false);

    const handleFilterPress = (filterId: string) => {
        console.log('Filter pressed:', filterId);
    };

    const openDetail = (id: string) => {
        router.push({
            pathname: '/animals/[id]',
            params: { id },
        });
    };

    const toggleLike = (id: string) => {
        setLikedPets((current) => ({
            ...current,
            [id]: !current[id],
        }));
    };

    return (
        <View style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
                    <ChevronBack width={20} height={20} />
                </TouchableOpacity>
            </View>

            <View style={styles.container}>
                <SearchBar onFilterPress={() => setIsFilterSheetVisible(true)} />

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filtersContainer}
                    style={styles.filtersScroll}
                >
                    {FILTERS.map((filter) => (
                        <SearchFilterChip
                            key={filter.id}
                            label={filter.label}
                            onPress={() => handleFilterPress(filter.id)}
                        />
                    ))}
                </ScrollView>

                <Text style={styles.sectionTitle}>Resultados de búsqueda</Text>

                <FlatList
                    style={styles.list}
                    data={searchPets}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 24 }]}
                    renderItem={({ item }) => (
                        <PetHorizontalCard
                            name={item.name}
                            details={item.details}
                            location={item.location}
                            image={item.image}
                            tags={item.tags}
                            isLiked={!!likedPets[item.id]}
                            onButtonPress={() => openDetail(item.id)}
                            onLikePress={() => toggleLike(item.id)}
                            style={styles.petCard}
                        />
                    )}
                />
            </View>
            <FilterBottomSheet
                visible={isFilterSheetVisible}
                onClose={() => setIsFilterSheetVisible(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 8,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 16,
        marginBottom: 8,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filtersScroll: {
        marginTop: 16,
        flexGrow: 0,
    },
    filtersContainer: {
        flexDirection: 'row',
        gap: 8,
        paddingRight: 4,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#111111',
        marginTop: 20,
        marginBottom: 16,
    },
    list: {
        flex: 1,
    },
    listContent: {
        paddingBottom: 24,
    },
    petCard: {
        width: '92%',
        maxWidth: 360,
        height: 210,
        alignSelf: 'center',
        marginBottom: 34,
    },
});