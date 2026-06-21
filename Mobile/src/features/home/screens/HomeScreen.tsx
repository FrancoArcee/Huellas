import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../../theme';
import { CustomText } from '../../../shared/components/ui/CustomText';
import { SearchBar } from '../../../shared/components/ui/SearchBar';
import { CategoryCarousel } from '../components/CategoryCarousel';
import { AnimalsCarousel } from '../components/AnimalsCarousel';
import { FilterBottomSheet } from '../components/FilterBottomSheet';

export const HomeScreen = () => {
  const router = useRouter();
  const [isFilterSheetVisible, setIsFilterSheetVisible] = useState(false);

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

  const handleApplyFilters = (filters: { category: string; size: string; location: string }) => {
    const params: Record<string, string> = { layout: 'map' };

    if (filters.category) params.category = filters.category;
    if (filters.size) params.size = filters.size;
    if (filters.location) params.location = filters.location;

    router.push({
      pathname: '/(tabs)/search',
      params,
    });
  };

  return (
    <View style={styles.screen}>
      {/* Contenido principal con scroll */}
      {/* Título */}
      <View style={styles.titleSection}>
        <CustomText variant="semiCaption" color="black">
          Adoptá
        </CustomText>
        <CustomText variant="h3" color="black">
          tu próximo compañero
        </CustomText>
      </View>

      {/* Barra de búsqueda + filtros */}
      <View style={styles.section}>
        <SearchBar onFilterPress={openFilterSheet} onSubmit={handleSearchSubmit} />
      </View>

      {/* Categorías */}
      <View style={styles.sectionWithTitle}>
        <CustomText variant="h4" color="textPrimary" style={styles.sectionTitle}>
          Categorias
        </CustomText>
        <CategoryCarousel />
      </View>

      {/* Sección "Cerca tuyo" — espacio reservado para las cards */}
      <View style={styles.sectionWithTitle}>
        <CustomText variant="h4" color="textPrimary" style={styles.sectionTitle}>
          Cerca tuyo
        </CustomText>
        <AnimalsCarousel />
        <View style={styles.cardsPlaceholder} />
      </View>

      <FilterBottomSheet
        visible={isFilterSheetVisible}
        onClose={closeFilterSheet}
        onApply={handleApplyFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: theme.spacing['6xl'],
    paddingBottom: theme.spacing['2xl'],
  },
  titleSection: {
    paddingHorizontal: theme.spacing['2xl'],
    marginBottom: theme.spacing['2xl'],
    fontFamily: theme.typography.fontFamily.bold,
  },
  section: {
    paddingHorizontal: theme.spacing['2xl'],
    marginBottom: theme.spacing['2xl'],
  },
  sectionWithTitle: {
    marginBottom: theme.spacing['2xl'],
  },
  sectionTitle: {
    paddingHorizontal: theme.spacing['2xl'],
    marginBottom: theme.spacing.lg,
  },
  // Espacio en blanco reservado para las cards de animales
  cardsPlaceholder: {
    height: 260,
  },
});
