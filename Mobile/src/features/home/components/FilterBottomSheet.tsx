import React, { useEffect, useState, useRef } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
} from 'react-native';
import { theme } from '../../../theme';
import { CustomText } from '../../../shared/components/ui/CustomText';
import ChevronDownIcon from '../../../assets/icons/buttons/chevronDown.svg';
import { AddressAutocomplete } from '../../../shared/components/ui/AddressAutocomplete';

export type FilterValues = {
  category: string;
  size: string;
  location: string;
  latitude?: number;
  longitude?: number;
  radius: number;
};

interface FilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply?: (filters: FilterValues) => void;
  onClear?: () => void;
  initialValues?: FilterValues;
}

const initialFilters: FilterValues = {
  category: '',
  size: '',
  location: '',
  radius: 25,
};

const categoryOptions = [
  { label: 'Perros', value: 'dog' },
  { label: 'Gatos', value: 'cat' },
  { label: 'Otros', value: 'other' },
];

const sizeOptions = [
  { label: 'Pequeño', value: 'small' },
  { label: 'Mediano', value: 'medium' },
  { label: 'Grande', value: 'large' },
];

const radiusOptions = [
  { label: '10 km', value: 10 },
  { label: '25 km', value: 25 },
  { label: '50 km', value: 50 },
];

const getOptionLabel = (
  options: { label: string; value: string | number }[],
  value: string | number,
) => {
  return options.find((option) => option.value === value)?.label ?? '';
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.75;

export const FilterBottomSheet = ({
  visible,
  onClose,
  onApply,
  onClear,
  initialValues = initialFilters,
}: FilterBottomSheetProps) => {
  const [filters, setFilters] = useState<FilterValues>(initialValues);
  const [openSelect, setOpenSelect] = useState<
    keyof Pick<FilterValues, 'category' | 'size' | 'radius'> | null
  >(null);

  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const [shouldRender, setShouldRender] = useState(visible);

  useEffect(() => {
    if (visible) {
      setFilters(initialValues);
      setOpenSelect(null);
      setShouldRender(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SHEET_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShouldRender(false);
      });
    }
  }, [
    visible,
    initialValues.category,
    initialValues.location,
    initialValues.radius,
    initialValues.size,
  ]);

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
    onApply?.({
      category: filters.category.trim(),
      size: filters.size.trim(),
      location: filters.location.trim(),
      radius: filters.radius,
      ...(filters.latitude !== undefined ? { latitude: filters.latitude } : {}),
      ...(filters.longitude !== undefined ? { longitude: filters.longitude } : {}),
    });
    onClose();
  };

  const handleClear = () => {
    setFilters(initialFilters);
    setOpenSelect(null);
    onClear?.();
  };

  return (
    <Modal visible={shouldRender} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.55],
              }),
            },
          ]}
        >
          <Pressable style={styles.backdropPressable} onPress={onClose} />
        </Animated.View>

        <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
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
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setOpenSelect((current) => (current === 'category' ? null : 'category'))}
                style={styles.selectControl}
              >
                <CustomText variant="body" color="textPrimary" style={styles.controlText}>
                  {getOptionLabel(categoryOptions, filters.category) || 'Seleccionar'}
                </CustomText>
                <ChevronDownIcon width={14} height={14} />
              </TouchableOpacity>
              {openSelect === 'category' && (
                <View style={styles.dropdown}>
                  {categoryOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      activeOpacity={0.8}
                      onPress={() => {
                        updateFilter('category', option.value);
                        setOpenSelect(null);
                      }}
                      style={[
                        styles.dropdownOption,
                        filters.category === option.value && styles.dropdownOptionSelected,
                      ]}
                    >
                      <CustomText variant="body" color="textPrimary" style={styles.dropdownOptionText}>
                        {option.label}
                      </CustomText>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.fieldGroup}>
              <CustomText variant="p" color="textPrimary" style={styles.label}>
                Tamaño
              </CustomText>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setOpenSelect((current) => (current === 'size' ? null : 'size'))}
                style={styles.selectControl}
              >
                <CustomText variant="body" color="textPrimary" style={styles.controlText}>
                  {getOptionLabel(sizeOptions, filters.size) || 'Seleccionar'}
                </CustomText>
                <ChevronDownIcon width={14} height={14} />
              </TouchableOpacity>
              {openSelect === 'size' && (
                <View style={styles.dropdown}>
                  {sizeOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      activeOpacity={0.8}
                      onPress={() => {
                        updateFilter('size', option.value);
                        setOpenSelect(null);
                      }}
                      style={[
                        styles.dropdownOption,
                        filters.size === option.value && styles.dropdownOptionSelected,
                      ]}
                    >
                      <CustomText variant="body" color="textPrimary" style={styles.dropdownOptionText}>
                        {option.label}
                      </CustomText>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.fieldGroup}>
              <CustomText variant="p" color="textPrimary" style={styles.label}>
                Localidad
              </CustomText>
              <AddressAutocomplete
                value={filters.location}
                onChangeText={(value) => updateFilter('location', value)}
                onSelect={(location) => {
                  setFilters((current) => {
                    const { latitude: _latitude, longitude: _longitude, ...rest } = current;
                    return location
                      ? {
                          ...rest,
                          latitude: location.latitude,
                          longitude: location.longitude,
                        }
                      : rest;
                  });
                }}
                placeholder="Localidad o dirección"
              />
            </View>

            <View style={styles.fieldGroup}>
              <CustomText variant="p" color="textPrimary" style={styles.label}>
                Distancia
              </CustomText>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setOpenSelect((current) => (current === 'radius' ? null : 'radius'))}
                style={styles.selectControl}
              >
                <CustomText variant="body" color="textPrimary" style={styles.controlText}>
                  {getOptionLabel(radiusOptions, filters.radius)}
                </CustomText>
                <ChevronDownIcon width={14} height={14} />
              </TouchableOpacity>
              {openSelect === 'radius' && (
                <View style={styles.dropdown}>
                  {radiusOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      activeOpacity={0.8}
                      onPress={() => {
                        updateFilter('radius', option.value);
                        setOpenSelect(null);
                      }}
                      style={[
                        styles.dropdownOption,
                        filters.radius === option.value && styles.dropdownOptionSelected,
                      ]}
                    >
                      <CustomText variant="body" color="textPrimary" style={styles.dropdownOptionText}>
                        {option.label}
                      </CustomText>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
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
        </Animated.View>
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
  },
  backdropPressable: {
    flex: 1,
  },
  sheet: {
    maxHeight: '75%',
    minHeight: '75%',
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
  dropdown: {
    marginTop: theme.spacing.xs,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    overflow: 'hidden',
  },
  dropdownOption: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  dropdownOptionSelected: {
    backgroundColor: '#FFE5C1',
  },
  dropdownOptionText: {
    color: theme.colors.textPrimary,
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
