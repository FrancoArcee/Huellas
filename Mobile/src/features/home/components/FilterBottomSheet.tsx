import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { theme } from '../../../theme';
import { CustomText } from '../../../shared/components/ui/CustomText';
import SearchIcon from '../../../assets/icons/screens/search.svg';
import ChevronDownIcon from '../../../assets/icons/buttons/chevronDown.svg';

type FilterValues = {
  category: string;
  size: string;
  location: string;
};

interface FilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply?: (filters: FilterValues) => void;
  onClear?: () => void;
}

const initialFilters: FilterValues = {
  category: '',
  size: '',
  location: '',
};

export const FilterBottomSheet = ({
  visible,
  onClose,
  onApply,
  onClear,
}: FilterBottomSheetProps) => {
  const [filters, setFilters] = useState<FilterValues>(initialFilters);

  const updateFilter = <Key extends keyof FilterValues>(
    key: Key,
    value: FilterValues[Key],
  ) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }));
  };

  const handleApply = () => {
    onApply?.(filters);
    onClose();
  };

  const handleClear = () => {
    setFilters(initialFilters);
    onClear?.();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable style={styles.backdrop} />

        <View style={styles.sheet}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Cerrar filtros"
            activeOpacity={0.7}
            onPress={onClose}
            style={styles.closeButton}
          >
            <View style={[styles.closeLine, styles.closeLineForward]} />
            <View style={[styles.closeLine, styles.closeLineBackward]} />
          </TouchableOpacity>

          <CustomText variant="h4" color="textPrimary" style={styles.title}>
            Filtros
          </CustomText>

          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <CustomText variant="p" color="textPrimary" style={styles.label}>
                Categoría
              </CustomText>
              <TouchableOpacity activeOpacity={0.8} style={styles.selectControl}>
                <CustomText variant="body" color="textPrimary" style={styles.controlText}>
                  {filters.category || 'Seleccionar'}
                </CustomText>
                <ChevronDownIcon width={14} height={14} />
              </TouchableOpacity>
            </View>

            <View style={styles.fieldGroup}>
              <CustomText variant="p" color="textPrimary" style={styles.label}>
                Tamaño
              </CustomText>
              <TouchableOpacity activeOpacity={0.8} style={styles.selectControl}>
                <CustomText variant="body" color="textPrimary" style={styles.controlText}>
                  {filters.size || 'Seleccionar'}
                </CustomText>
                <ChevronDownIcon width={14} height={14} />
              </TouchableOpacity>
            </View>

            <View style={styles.fieldGroup}>
              <CustomText variant="p" color="textPrimary" style={styles.label}>
                Localidad
              </CustomText>
              <View style={styles.inputControl}>
                <TextInput
                  value={filters.location}
                  onChangeText={(value) => updateFilter('location', value)}
                  placeholder="Nombre"
                  placeholderTextColor={theme.colors.gray100}
                  style={styles.input}
                />
                <SearchIcon width={20} height={20} />
              </View>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity activeOpacity={0.85} onPress={handleApply} style={styles.applyButton}>
              <CustomText variant="body" color="white" style={styles.actionText}>
                Aplicar
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.85} onPress={handleClear} style={styles.clearButton}>
              <CustomText variant="body" color="white" style={styles.actionText}>
                Limpiar
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.black,
    opacity: 0.55,
  },
  sheet: {
    maxHeight: '60%',
    minHeight: '60%',
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: theme.spacing['2xl'],
    paddingTop: theme.spacing['2xl'],
    paddingBottom: theme.spacing.lg,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.md,
    top: theme.spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.gray200,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  closeLine: {
    position: 'absolute',
    width: 15,
    height: 2,
    borderRadius: 1,
    backgroundColor: theme.colors.gray600,
  },
  closeLineForward: {
    transform: [{ rotate: '45deg' }],
  },
  closeLineBackward: {
    transform: [{ rotate: '-45deg' }],
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  form: {
    gap: theme.spacing.xl,
  },
  fieldGroup: {
    gap: theme.spacing.sm,
  },
  label: {
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  selectControl: {
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlText: {
    flex: 1,
    color: theme.colors.gray500,
  },
  inputControl: {
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 0,
    paddingVertical: 0,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 14,
    color: theme.colors.textPrimary,
    includeFontPadding: false,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing['2xl'],
    marginTop: 'auto',
    paddingTop: theme.spacing.xl,
  },
  applyButton: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButton: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.gray700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontFamily: theme.typography.fontFamily.semiBold,
  },
});
