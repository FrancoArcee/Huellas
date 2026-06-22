import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import * as Location from 'expo-location';
import { theme } from '../../../theme';
import SearchIcon from '../../../assets/icons/screens/search.svg';
import LocationIcon from '../../../assets/icons/location.svg';
import {
  locationService,
  type LocationBias,
  type LocationSuggestion,
  type SelectedLocation,
} from '../../services/locationService';

interface AddressAutocompleteProps {
  value: string;
  onChangeText: (value: string) => void;
  onSelect: (location: SelectedLocation | null) => void;
  placeholder?: string;
  bias?: LocationBias;
  allowCurrentLocation?: boolean;
  style?: StyleProp<ViewStyle>;
}

function formatReverseGeocode(address: Location.LocationGeocodedAddress): string {
  return [
    [address.street, address.streetNumber].filter(Boolean).join(' '),
    address.district,
    address.city,
    address.region,
    address.country,
  ].filter(Boolean).join(', ');
}

export const AddressAutocomplete = ({
  value,
  onChangeText,
  onSelect,
  placeholder = 'Buscá una dirección',
  bias,
  allowCurrentLocation = true,
  style,
}: AddressAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState(value);
  const requestId = useRef(0);

  useEffect(() => {
    if (!focused) setSelectedDescription(value);
  }, [focused, value]);

  useEffect(() => {
    if (!focused || value.trim().length < 3 || value === selectedDescription) {
      setSuggestions([]);
      return;
    }

    const currentRequest = ++requestId.current;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const results = await locationService.autocomplete(
          value.trim(),
          bias,
        );
        if (requestId.current === currentRequest) setSuggestions(results);
      } catch (request: any) {
        if (requestId.current === currentRequest) {
          setSuggestions([]);
          setError(
            request.response?.data?.message ??
            'No pudimos buscar direcciones en este momento.',
          );
        }
      } finally {
        if (requestId.current === currentRequest) setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [bias, focused, selectedDescription, value]);

  const handleTextChange = (text: string) => {
    setSelectedDescription('');
    setError('');
    onChangeText(text);
    onSelect(null);
  };

  const handleSuggestionPress = (suggestion: LocationSuggestion) => {
    setError('');
    const selected: SelectedLocation = {
      placeId: suggestion.placeId,
      formattedAddress: suggestion.formattedAddress,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
    };
    setSelectedDescription(selected.formattedAddress);
    onChangeText(selected.formattedAddress);
    onSelect(selected);
    setSuggestions([]);
    setFocused(false);
  };

  const handleCurrentLocation = async () => {
    setLoading(true);
    setError('');
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        setError('Necesitamos permiso de ubicación para usar tu posición actual.');
        return;
      }

      const position = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = position.coords;
      const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });
      const formattedAddress = addresses[0]
        ? formatReverseGeocode(addresses[0])
        : `Ubicación actual (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`;
      const selected: SelectedLocation = {
        formattedAddress,
        latitude,
        longitude,
      };

      setSelectedDescription(formattedAddress);
      onChangeText(formattedAddress);
      onSelect(selected);
      setSuggestions([]);
      setFocused(false);
    } catch {
      setError('No pudimos obtener tu ubicación actual.');
    } finally {
      setLoading(false);
    }
  };

  const showPanel = focused && (
    allowCurrentLocation ||
    loading ||
    suggestions.length > 0 ||
    Boolean(error)
  );

  return (
    <View style={[styles.root, style]}>
      <View style={styles.inputControl}>
        <TextInput
          value={value}
          onChangeText={handleTextChange}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.gray400}
          autoCorrect={false}
          style={styles.input}
        />
        {loading
          ? <ActivityIndicator size="small" color={theme.colors.primary} />
          : <SearchIcon width={20} height={20} />}
      </View>

      {showPanel && (
        <View style={styles.panel}>
          {allowCurrentLocation && (
            <Pressable onPress={handleCurrentLocation} style={styles.currentLocation}>
              <LocationIcon width={18} height={18} color={theme.colors.primary} />
              <Text style={styles.currentLocationText}>Usar mi ubicación actual</Text>
            </Pressable>
          )}

          {suggestions.map((suggestion) => (
            <Pressable
              key={suggestion.placeId}
              onPress={() => handleSuggestionPress(suggestion)}
              style={styles.suggestion}
            >
              <Text numberOfLines={1} style={styles.mainText}>
                {suggestion.mainText}
              </Text>
              {suggestion.secondaryText ? (
                <Text numberOfLines={2} style={styles.secondaryText}>
                  {suggestion.secondaryText}
                </Text>
              ) : null}
            </Pressable>
          ))}

          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    zIndex: 20,
  },
  inputControl: {
    minHeight: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.gray200,
  },
  input: {
    flex: 1,
    paddingVertical: 11,
    paddingRight: 8,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  panel: {
    marginTop: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
    backgroundColor: theme.colors.white,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  currentLocation: {
    minHeight: 46,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  },
  currentLocationText: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: 13,
  },
  suggestion: {
    minHeight: 54,
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.gray200,
  },
  mainText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: 13,
  },
  secondaryText: {
    marginTop: 2,
    color: theme.colors.gray500,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 11,
  },
  error: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#C0392B',
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: 12,
  },
});
