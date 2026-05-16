import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../../../theme';
import { CustomText } from '../../../shared/components/ui/CustomText';
import { SearchBar } from '../../../shared/components/ui/SearchBar';
import { CategoryCarousel } from '../components/CategoryCarousel';
import { AnimalsCarousel } from '../components/AnimalsCarousel';

export const HomeScreen = () => {
  return (
    <View style={styles.screen}>
      {/* Contenido principal con scroll */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
          <SearchBar />
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
      </ScrollView>
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
