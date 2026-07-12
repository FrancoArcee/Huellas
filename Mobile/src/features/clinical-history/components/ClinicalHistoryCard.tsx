// ───────────────────────────────────────────────
//  Clinical History Card — Individual medical record card
// ───────────────────────────────────────────────

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Linking,
  Pressable,
} from 'react-native';
import {
  Syringe,
  Sparkles,
  Calendar,
  MapPin,
  FileText,
  MoreVertical,
  Stethoscope,
  HeartPulse,
  FileSearch,
} from 'lucide-react-native';
import type { ClinicalHistoryItem } from '@huellas/shared';
import { colors } from '../../../theme/index';

interface ClinicalHistoryCardProps {
  item: ClinicalHistoryItem;
  onEdit?: (() => void) | undefined;
  onDelete?: (() => void) | undefined;
  readOnly?: boolean | undefined;
}

const TYPE_LABELS: Record<string, string> = {
  VACUNACION: 'Vacunación',
  DESPARASITACION: 'Desparasitación',
  CHEQUEO_PREVENTIVO: 'Chequeo preventivo',
  CONSULTA_GENERAL: 'Consulta General',
  CIRUGIA: 'Cirugía',
  DIAGNOSTICO: 'Diagnóstico',
  OTRO: 'Otro',
};

const getIconAndColors = (type: string) => {
  const lower = type.toLowerCase();
  if (lower.includes('vacun') || lower.includes('vacuna')) {
    return { Icon: Syringe, bg: colors.cream, color: colors.primary };
  }
  if (lower.includes('desparasit') || lower.includes('bicho')) {
    return { Icon: Sparkles, bg: '#EAE8FF', color: colors.secondary };
  }
  if (lower.includes('control') || lower.includes('preventivo') || lower.includes('chequeo')) {
    return { Icon: Calendar, bg: '#E0F2FE', color: '#0284C7' };
  }
  if (lower.includes('consulta') || lower.includes('stethoscope') || lower.includes('general')) {
    return { Icon: Stethoscope, bg: '#E0F2FE', color: colors.secondary };
  }
  if (lower.includes('cirugia') || lower.includes('heart') || lower.includes('pulse')) {
    return { Icon: HeartPulse, bg: '#FEE2E2', color: colors.danger };
  }
  if (lower.includes('diagnostico') || lower.includes('search')) {
    return { Icon: FileSearch, bg: '#E0F2FE', color: '#0284C7' };
  }
  return { Icon: FileText, bg: '#F3F4F6', color: '#4B5563' };
};

const formatDate = (isoString: string) => {
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return isoString;
    return [
      String(date.getUTCDate()).padStart(2, '0'),
      String(date.getUTCMonth() + 1).padStart(2, '0'),
      date.getUTCFullYear(),
    ].join('/');
  } catch {
    return isoString;
  }
};

export function ClinicalHistoryCard({ item, onEdit, onDelete, readOnly = false }: ClinicalHistoryCardProps) {
  const { Icon, bg, color } = getIconAndColors(item.type);
  const [menuVisible, setMenuVisible] = React.useState(false);

  const handleOpenComprobante = async () => {
    if (!item.comprobante) {
      Alert.alert('Sin comprobante', 'Este registro no tiene un comprobante adjunto.');
      return;
    }
    try {
      const supported = await Linking.canOpenURL(item.comprobante);
      if (supported) {
        await Linking.openURL(item.comprobante);
      } else {
        Alert.alert('Error', 'No se puede abrir el comprobante en este dispositivo.');
      }
    } catch (error) {
      console.error('Error opening receipt:', error);
      Alert.alert('Error', 'Hubo un problema al abrir el archivo.');
    }
  };

  const handleActionsMenu = () => {
    setMenuVisible(prev => !prev);
  };

  return (
    <View style={[styles.card, menuVisible && { zIndex: 999 }]}>
      <View style={[styles.iconContainer, { backgroundColor: bg }]}>
        <Icon width={28} height={28} color={color} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {TYPE_LABELS[item.type] || item.type}
        </Text>
        {!!item.name && (
          <Text style={styles.nameText} numberOfLines={1}>
            {item.name}
          </Text>
        )}

        <View style={styles.row}>
          <View style={styles.metaItem}>
            <Calendar width={12} height={12} color={colors.gray500} style={styles.metaIcon} />
            <Text style={styles.metaText}>{formatDate(item.date)}</Text>
          </View>

          <View style={styles.metaItem}>
            <MapPin width={12} height={12} color={colors.gray500} style={styles.metaIcon} />
            <Text style={styles.metaText} numberOfLines={1}>{item.veterinary}</Text>
          </View>
        </View>

        <Text style={styles.doctorText} numberOfLines={1}>
          {item.veterinarian}
        </Text>
      </View>

      <View style={styles.actionsContainer}>
        {!!item.comprobante && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={handleOpenComprobante}
            activeOpacity={0.7}
          >
            <View style={styles.receiptIconWrapper}>
              <FileText width={22} height={22} color={colors.gray700} />
            </View>
          </TouchableOpacity>
        )}

        {!readOnly && (onEdit || onDelete) && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={handleActionsMenu}
            activeOpacity={0.7}
          >
            <MoreVertical width={20} height={20} color={colors.gray500} />
          </TouchableOpacity>
        )}
      </View>

      {!readOnly && menuVisible && (
        <>
          <Pressable
            style={styles.menuBackdrop}
            onPress={() => setMenuVisible(false)}
          />
          <View style={styles.dropdownMenu}>
            {!!onEdit && (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setMenuVisible(false);
                  onEdit();
                }}
              >
                <Text style={styles.dropdownText}>Editar</Text>
              </TouchableOpacity>
            )}
            {!!onDelete && (
              <TouchableOpacity
                style={[styles.dropdownItem, styles.lastDropdownItem]}
                onPress={() => {
                  setMenuVisible(false);
                  onDelete();
                }}
              >
                <Text style={[styles.dropdownText, styles.destructiveText]}>Eliminar</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingVertical: 16,
    paddingLeft: 16,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    height: 110,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  nameText: {
    fontSize: 14,
    color: colors.gray700,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 3,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 100,
  },
  metaIcon: {
    marginRight: 3,
  },
  metaText: {
    fontSize: 11,
    color: colors.gray500,
  },
  doctorText: {
    fontSize: 11,
    color: colors.gray500,
    fontStyle: 'italic',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginLeft: 4,
  },
  actionBtn: {
    padding: 6,
  },
  receiptIconWrapper: {
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 8,
    padding: 6,
    backgroundColor: colors.gray50,
  },
  menuBackdrop: {
    position: 'absolute',
    top: -500,
    bottom: -500,
    left: -500,
    right: -500,
    backgroundColor: 'transparent',
    zIndex: 99,
  },
  dropdownMenu: {
    position: 'absolute',
    right: 16,
    top: 75,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray200,
    width: 120,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  lastDropdownItem: {
    borderBottomWidth: 0,
  },
  dropdownText: {
    fontSize: 14,
    color: colors.gray700,
    fontWeight: '500',
  },
  destructiveText: {
    color: colors.danger,
  },
});
