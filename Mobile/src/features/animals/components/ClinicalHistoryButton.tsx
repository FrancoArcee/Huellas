import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ShieldCheck, ChevronRight } from 'lucide-react-native';
import { theme } from '../../../theme';
import { CustomText } from '../../../shared/components/ui/CustomText';

interface ClinicalHistoryButtonProps {
  onPress: () => void;
  vaccineCount?: number;
}

export const ClinicalHistoryButton = ({ onPress, vaccineCount = 0 }: ClinicalHistoryButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.cardButton, pressed && styles.cardButtonActive]}
    >
      <View style={styles.leftContainer}>
        <View style={styles.iconShieldBadge}>
          <ShieldCheck size={22} color={theme.colors.white} />
        </View>

        <View style={styles.textContainer}>
          <CustomText variant="body" style={styles.buttonSubtitle}>
            Clinica y Salud
          </CustomText>
          <CustomText variant="h4" style={styles.buttonTitle}>
            Ver Historial Clinico
          </CustomText>
          <View style={styles.statusIndicatorRow}>
            <View style={styles.greenDot} />
            <CustomText variant="caption" style={styles.statusText}>
              {vaccineCount} {vaccineCount === 1 ? 'vacuna aplicada' : 'vacunas aplicadas'}
            </CustomText>
          </View>
        </View>
      </View>

      <View style={styles.arrowCircle}>
        <ChevronRight size={16} color={theme.colors.white} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardButton: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 12,
  },
  cardButtonActive: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconShieldBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    justifyContent: 'center',
  },
  buttonSubtitle: {
    color: theme.colors.secondaryLight,
    fontFamily: theme.typography.fontFamily.medium,
    marginBottom: 2,
  },
  buttonTitle: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 18,
    marginBottom: 4,
  },
  statusIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#27ae60',
    marginRight: 6,
  },
  statusText: {
    color: theme.colors.secondaryLight,
  },
  arrowCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
