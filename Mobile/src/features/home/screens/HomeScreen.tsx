import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { theme } from '../../../theme';
import { CustomText } from '../../../shared/components/ui/CustomText';
import { SearchBar } from '../../../shared/components/ui/SearchBar';
import { Button } from '../../../shared/components/ui/Button';
import { CategoryCarousel } from '../components/CategoryCarousel';
import { AnimalsCarousel } from '../components/AnimalsCarousel';
import { FilterBottomSheet } from '../components/FilterBottomSheet';
import { useHomeData } from '../hooks/useHomeData';

export const HomeScreen = () => {
  const {
    isFilterSheetVisible,
    locationState,
    animals,
    loadingAnimals,
    openFilterSheet,
    closeFilterSheet,
    handleSearchSubmit,
    handleApplyFilters,
    handleEnableLocation,
    handleFavoriteToggle,
    syncFavorites,
  } = useHomeData();

  useFocusEffect(
    useCallback(() => {
      syncFavorites();
    }, [syncFavorites])
  );

  const renderCercaTuyo = () => {
    if (locationState === 'loading' || (locationState === 'granted' && loadingAnimals)) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      );
    }

    if (locationState === 'denied') {
      return (
        <View style={styles.noLocationContainer}>
          <CustomText variant="body" color="textSecondary" style={styles.noLocationText}>
            Para ver resultados debes permitir el acceso a la ubicación del dispositivo
          </CustomText>
          <Button
            title="Habilitar ubicación"
            onPress={handleEnableLocation}
            style={styles.enableLocationButton}
          />
        </View>
      );
    }

    if (animals.length === 0) {
      return (
        <View style={styles.noAnimalsContainer}>
          <CustomText variant="body" color="textSecondary" style={styles.noAnimalsText}>
            No hay publicaciones cerca tuyo
          </CustomText>
        </View>
      );
    }

    return (
      <AnimalsCarousel
        animals={animals}
        onFavoriteToggle={handleFavoriteToggle}
      />
    );
  };

  return (
    <View style={styles.screen}>
      <View
        style={styles.scroll}
      >
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

        {/* Sección "Cerca tuyo" */}
        <View style={styles.sectionWithTitle}>
          <CustomText variant="h4" color="textPrimary" style={styles.sectionTitle}>
            Cerca tuyo
          </CustomText>
          {renderCercaTuyo()}
        </View>
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
  centerContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noLocationContainer: {
    paddingHorizontal: theme.spacing['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  noLocationText: {
    textAlign: 'center',
    fontFamily: theme.typography.fontFamily.medium,
    lineHeight: 20,
  },
  enableLocationButton: {
    maxWidth: 240,
    marginTop: theme.spacing.xs,
  },
  noAnimalsContainer: {
    paddingHorizontal: theme.spacing['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },
  noAnimalsText: {
    textAlign: 'center',
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.textSecondary,
  },
});
