import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../../theme';
import { CustomText } from '../../../shared/components/ui/CustomText';
import { SearchBar } from '../../../shared/components/ui/SearchBar';
import { CategoryCarousel } from '../components/CategoryCarousel';
import { AnimalsCarousel } from '../components/AnimalsCarousel';
import { FilterBottomSheet } from '../components/FilterBottomSheet';

export const HomeScreen = () => {
  const [isFilterSheetVisible, setIsFilterSheetVisible] = useState(false);

  const openFilterSheet = () => {
    setIsFilterSheetVisible(true);
  };

  const closeFilterSheet = () => {
    setIsFilterSheetVisible(false);
  };

  return (
    <View style={styles.screen}>
      {/* Contenido principal con scroll */}
      {/* Título */}
      <View style={styles.titleSection}>
        <CustomText variant="h4" color="textPrimary">
          Adoptá
        </CustomText>
        <CustomText variant="h1" color="black">
          tu próximo compañero
        </CustomText>
      </View>

      {/* Barra de búsqueda + filtros */}
      <View style={styles.section}>
        <SearchBar onFilterPress={openFilterSheet} />
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

      <FilterBottomSheet visible={isFilterSheetVisible} onClose={closeFilterSheet} />
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
