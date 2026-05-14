import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../../theme';
import SearchIcon from '../../../assets/icons/screens/search.svg';
import FilterIcon from '../../../assets/icons/buttons/filter.svg';

export const SearchBar = () => {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        {/* Ícono de búsqueda — en el futuro puede funcionar como botón de acción */}
        <TouchableOpacity activeOpacity={0.7} style={styles.searchIconContainer}>
          <SearchIcon width={18} height={18} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Buscá por raza, edad, ubicación...."
          placeholderTextColor={theme.colors.gray400}
          editable={true}
        />
      </View>

      {/* Botón de filtros — la modal de filtros se implementará aparte */}
      <TouchableOpacity style={styles.filterButton} activeOpacity={0.8}>
        <FilterIcon width={18} height={18} fill={theme.colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  inputWrapper: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: 100,
    paddingHorizontal: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIconContainer: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 14,
    color: theme.colors.textPrimary,
    padding: 0,
    paddingVertical: 0,
    textAlignVertical: 'center',
    includeFontPadding: false, // Android agrega padding interno a las fuentes que desplaza el texto hacia arriba
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 4,
  },
});
