import React, { useEffect, useState, useRef } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
} from 'react-native';
import { theme } from '../../../theme';
import { CustomText } from '../../../shared/components/ui/CustomText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChevronDownIcon from '../../../assets/icons/buttons/chevronDown.svg';
import { AddressAutocomplete } from '../../../shared/components/ui/AddressAutocomplete';

export type FilterValues = {
  category: string;
  size: string;
  gender: string;
  status: string;
  location: string;
  placeId?: string;
  latitude?: number;
  longitude?: number;
  radius: number; // 0 = sin límite de distancia
  minAge?: number;
  maxAge?: number;
  neutered?: boolean;
};

interface FilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply?: (filters: FilterValues) => void;
  onClear?: () => void;
  initialValues?: FilterValues;
  hasUserLocation?: boolean;
}

export const NO_RADIUS = 0;

const initialFilters: FilterValues = {
  category: '',
  size: '',
  gender: '',
  status: '',
  location: '',
  radius: 25,
};

type SelectOption = { label: string; value: string | number };

const categoryOptions: SelectOption[] = [
  { label: 'Todos', value: '' },
  { label: 'Perros', value: 'dog' },
  { label: 'Gatos', value: 'cat' },
  { label: 'Aves', value: 'bird' },
  { label: 'Conejos', value: 'rabbit' },
  { label: 'Hamsters', value: 'hamster' },
  { label: 'Peces', value: 'fish' },
  { label: 'Otros', value: 'other' },
];

const sizeOptions: SelectOption[] = [
  { label: 'Todos', value: '' },
  { label: 'Pequeño', value: 'small' },
  { label: 'Mediano', value: 'medium' },
  { label: 'Grande', value: 'large' },
];

const genderOptions: SelectOption[] = [
  { label: 'Todos', value: '' },
  { label: 'Macho', value: 'male' },
  { label: 'Hembra', value: 'female' },
];

const statusOptions: SelectOption[] = [
  { label: 'Todos', value: '' },
  { label: 'En adopción', value: 'EN_ADOPCION' },
  { label: 'En tránsito', value: 'EN_TRANSITO' },
];

const neuteredOptions: SelectOption[] = [
  { label: 'Todos', value: '' },
  { label: 'Si', value: 'true' },
  { label: 'No', value: 'false' },
];

const radiusOptions: SelectOption[] = [
  { label: '5 km', value: 5 },
  { label: '10 km', value: 10 },
  { label: '25 km', value: 25 },
  { label: '50 km', value: 50 },
  { label: '100 km', value: 100 },
  { label: 'Sin límite', value: NO_RADIUS },
];

type RangePreset = { label: string; chip?: string; value: string; min?: number; max?: number };

export const agePresets: RangePreset[] = [
  { label: 'Todas', value: '' },
  { label: 'Cría (0 a 1 año)', chip: 'Cría', value: '0-1', min: 0, max: 1 },
  { label: 'Joven (1 a 3 años)', chip: 'Joven', value: '1-3', min: 1, max: 3 },
  { label: 'Adulto (3 a 8 años)', chip: 'Adulto', value: '3-8', min: 3, max: 8 },
  { label: 'Adulto Mayor (8+ años)', chip: 'Adulto Mayor', value: '8+', min: 8 },
];

const presetFromRange = (presets: RangePreset[], min?: number, max?: number) =>
  presets.find((preset) => preset.min === min && preset.max === max)?.value ?? '';

const getOptionLabel = (options: SelectOption[], value: string | number) => {
  return options.find((option) => option.value === value)?.label ?? '';
};

type SelectKey = 'category' | 'size' | 'gender' | 'status' | 'neutered' | 'ageRange' | 'radius';

type SheetFilters = {
  category: string;
  size: string;
  gender: string;
  status: string;
  neutered: string;
  location: string;
  placeId?: string;
  latitude?: number;
  longitude?: number;
  radius: number;
  ageRange: string;
};

const toSheetFilters = (values: FilterValues): SheetFilters => ({
  category: values.category,
  size: values.size,
  gender: values.gender,
  status: values.status,
  neutered: values.neutered === undefined ? '' : String(values.neutered),
  location: values.location,
  ...(values.placeId !== undefined ? { placeId: values.placeId } : {}),
  ...(values.latitude !== undefined ? { latitude: values.latitude } : {}),
  ...(values.longitude !== undefined ? { longitude: values.longitude } : {}),
  radius: values.radius,
  ageRange: presetFromRange(agePresets, values.minAge, values.maxAge),
});

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.75;

export const FilterBottomSheet = ({
  visible,
  onClose,
  onApply,
  onClear,
  initialValues = initialFilters,
  hasUserLocation = false,
}: FilterBottomSheetProps) => {
  const insets = useSafeAreaInsets();
  const [filters, setFilters] = useState<SheetFilters>(toSheetFilters(initialValues));
  const [openSelect, setOpenSelect] = useState<SelectKey | null>(null);

  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const [shouldRender, setShouldRender] = useState(visible);

  useEffect(() => {
    if (visible) {
      setFilters(toSheetFilters(initialValues));
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
    initialValues.size,
    initialValues.gender,
    initialValues.status,
    initialValues.location,
    initialValues.placeId,
    initialValues.latitude,
    initialValues.longitude,
    initialValues.radius,
    initialValues.minAge,
    initialValues.maxAge,
    initialValues.neutered,
  ]);

  const updateFilter = <Key extends keyof SheetFilters>(
    key: Key,
    value: SheetFilters[Key],
  ) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }));
  };

  const handleApply = () => {
    const agePreset = agePresets.find((preset) => preset.value === filters.ageRange);
    onApply?.({
      category: filters.category.trim(),
      size: filters.size.trim(),
      gender: filters.gender.trim(),
      status: filters.status.trim(),
      location: filters.location.trim(),
      radius: filters.radius,
      ...(filters.placeId !== undefined ? { placeId: filters.placeId } : {}),
      ...(filters.latitude !== undefined ? { latitude: filters.latitude } : {}),
      ...(filters.longitude !== undefined ? { longitude: filters.longitude } : {}),
      ...(agePreset?.min !== undefined ? { minAge: agePreset.min } : {}),
      ...(agePreset?.max !== undefined ? { maxAge: agePreset.max } : {}),
      ...(filters.neutered === 'true' ? { neutered: true } : filters.neutered === 'false' ? { neutered: false } : {}),
    });
    onClose();
  };

  const handleClear = () => {
    setFilters(toSheetFilters(initialFilters));
    setOpenSelect(null);
    onClear?.();
    onClose();
  };

  const hasSelectedPlace = filters.latitude !== undefined && filters.longitude !== undefined;
  const radiusActive = filters.radius !== NO_RADIUS;
  const radiusHint = !radiusActive
    ? 'Se mostrarán resultados de cualquier distancia.'
    : hasSelectedPlace
      ? `Hasta ${filters.radius} km desde ${filters.location || 'la localidad elegida'}.`
      : hasUserLocation
        ? `Hasta ${filters.radius} km desde tu ubicación actual.`
        : 'Elegí una localidad o activá tu ubicación para aplicar la distancia.';
  const radiusHintIsWarning = radiusActive && !hasSelectedPlace && !hasUserLocation;

  const renderSelect = (
    label: string,
    key: SelectKey,
    options: SelectOption[],
    hint?: { text: string; warning: boolean },
  ) => {
    const selectedValue = filters[key];
    const selectedLabel = getOptionLabel(options, selectedValue);
    return (
      <View style={styles.fieldGroup}>
        <CustomText variant="p" color="textPrimary" style={styles.label}>
          {label}
        </CustomText>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setOpenSelect((current) => (current === key ? null : key))}
          style={styles.selectControl}
        >
          <CustomText
            variant="body"
            color="textPrimary"
            style={[styles.controlText, selectedLabel && selectedLabel !== 'Todos' && selectedLabel !== 'Todas' ? styles.controlTextActive : null]}
          >
            {selectedLabel || 'Seleccionar'}
          </CustomText>
          <ChevronDownIcon width={14} height={14} />
        </TouchableOpacity>
        {openSelect === key && (
          <View style={styles.dropdown}>
            {options.map((option) => (
              <TouchableOpacity
                key={String(option.value)}
                activeOpacity={0.8}
                onPress={() => {
                  updateFilter(key, option.value as never);
                  setOpenSelect(null);
                }}
                style={[
                  styles.dropdownOption,
                  selectedValue === option.value && styles.dropdownOptionSelected,
                ]}
              >
                <CustomText variant="body" color="textPrimary" style={styles.dropdownOptionText}>
                  {option.label}
                </CustomText>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {hint && (
          <CustomText
            variant="body"
            color="textSecondary"
            style={[styles.hintText, hint.warning && styles.hintTextWarning]}
          >
            {hint.text}
          </CustomText>
        )}
      </View>
    );
  };

  return (
    <Modal visible={shouldRender} transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
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

        <Animated.View
          style={[
            styles.sheet,
            {
              paddingBottom: Math.max(insets.bottom + 12, theme.spacing.lg),
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
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

          <ScrollView
            style={styles.formScroll}
            contentContainerStyle={styles.form}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {renderSelect('Categoría', 'category', categoryOptions)}
            {renderSelect('Tamaño', 'size', sizeOptions)}
            {renderSelect('Género', 'gender', genderOptions)}
            {renderSelect('Estado', 'status', statusOptions)}
            {renderSelect('Castrado', 'neutered', neuteredOptions)}
            {renderSelect(
              'Edad',
              'ageRange',
              agePresets.map(({ label, value }) => ({ label, value })),
            )}

            <View style={styles.fieldGroup}>
              <CustomText variant="p" color="textPrimary" style={styles.label}>
                Localidad
              </CustomText>
              <AddressAutocomplete
                value={filters.location}
                onChangeText={(value) => {
                  setFilters((current) => {
                    const {
                      latitude: _latitude,
                      longitude: _longitude,
                      placeId: _placeId,
                      ...rest
                    } = current;
                    return { ...rest, location: value };
                  });
                }}
                onSelect={(location) => {
                  setFilters((current) => {
                    const {
                      latitude: _latitude,
                      longitude: _longitude,
                      placeId: _placeId,
                      ...rest
                    } = current;
                    return location
                      ? {
                          ...rest,
                          latitude: location.latitude,
                          longitude: location.longitude,
                          ...(location.placeId ? { placeId: location.placeId } : {}),
                        }
                      : rest;
                  });
                }}
                placeholder="Localidad o dirección"
              />
            </View>

            {renderSelect('Distancia', 'radius', radiusOptions, {
              text: radiusHint,
              warning: radiusHintIsWarning,
            })}
          </ScrollView>

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
    maxHeight: '85%',
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
  formScroll: {
    flexGrow: 0,
    flexShrink: 1,
  },
  form: {
    gap: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
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
  controlTextActive: {
    color: theme.colors.textPrimary,
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
  hintText: {
    fontSize: 12,
    lineHeight: 16,
  },
  hintTextWarning: {
    color: theme.colors.primary,
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
