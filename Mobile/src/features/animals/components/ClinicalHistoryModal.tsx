import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  ShieldCheck,
  X,
  Calendar,
  FileText,
  Syringe,
  Bug,
  Stethoscope,
  HeartPulse,
  FileSearch,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { theme } from '../../../theme';
import { CustomText } from '../../../shared/components/ui/CustomText';
import { animalService } from '../services/animalService';
import type { ClinicalHistory, ClinicalHistoryEntry, EventTypeValues } from '@huellas/shared';

interface ClinicalHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  postId: string;
  petName: string;
}

const eventTypeConfig: Record<
  EventTypeValues,
  { icon: LucideIcon; lineColor: string; label: string }
> = {
  VACUNACION: { icon: Syringe, lineColor: '#27ae60', label: 'Vacunacion' },
  DESPARASITACION: { icon: Bug, lineColor: theme.colors.primary, label: 'Desparasitacion' },
  CONSULTA_GENERAL: { icon: Stethoscope, lineColor: theme.colors.secondary, label: 'Consulta General' },
  CIRUGIA: { icon: HeartPulse, lineColor: theme.colors.danger, label: 'Cirugia' },
  DIAGNOSTICO: { icon: FileSearch, lineColor: theme.colors.primary, label: 'Diagnostico' },
};

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export const ClinicalHistoryModal = ({
  visible,
  onClose,
  postId,
  petName,
}: ClinicalHistoryModalProps) => {
  const [history, setHistory] = useState<ClinicalHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible || !postId) return;

    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await animalService.getClinicalHistory(postId);
        setHistory(data);
      } catch (err) {
        console.error('Error fetching clinical history:', err);
        setError('No se pudo cargar el historial clinico.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [visible, postId]);

  const entries = history?.entries ?? [];
  const vaccineCount = entries.filter((e) => e.eventType === 'VACUNACION').length;

  const handleOpenDocument = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIconBadge}>
                <ShieldCheck size={20} color={theme.colors.secondary} />
              </View>
              <View>
                <CustomText variant="h4" style={styles.headerTitle}>
                  Historial Clinico de {petName}
                </CustomText>
                <View style={styles.officialBadgeRow}>
                  <View style={styles.smallGreenDot} />
                  <CustomText variant="caption" style={styles.officialText}>
                    Registro Oficial de Salud
                  </CustomText>
                </View>
              </View>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={22} color={theme.colors.black} />
            </Pressable>
          </View>

          {loading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={theme.colors.secondary} />
            </View>
          ) : error ? (
            <View style={styles.centered}>
              <CustomText variant="p" color="textSecondary" style={styles.errorText}>
                {error}
              </CustomText>
            </View>
          ) : entries.length === 0 ? (
            <View style={styles.centered}>
              <CustomText variant="p" color="textSecondary" style={styles.errorText}>
                No hay registros en el historial clinico.
              </CustomText>
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator
              contentContainerStyle={styles.scrollContainer}
            >
              {entries.map((entry: ClinicalHistoryEntry, index: number) => {
                const config = eventTypeConfig[entry.eventType] ?? eventTypeConfig.CONSULTA_GENERAL;
                const IconComponent = config.icon;

                return (
                  <View key={entry.id} style={styles.timelineRow}>
                    <View style={styles.timelineLeftColumn}>
                      <View style={styles.lineSegment} />
                      <View style={styles.iconTimelineCircle}>
                        <IconComponent size={20} color={config.lineColor} />
                      </View>
                      {index !== entries.length - 1 && <View style={styles.lineSegment} />}
                    </View>

                    <View style={styles.cardContainer}>
                      <CustomText variant="h4" style={styles.cardTitle}>
                        {entry.title}
                      </CustomText>

                      <View style={styles.completedBadge}>
                        <CustomText variant="caption" style={styles.completedBadgeText}>
                          COMPLETADA
                        </CustomText>
                      </View>

                      <View style={styles.metaRow}>
                        <Calendar size={14} color={theme.colors.gray500} />
                        <CustomText variant="body" style={styles.dateText}>
                          {formatDate(entry.date)}
                        </CustomText>
                      </View>

                      <CustomText variant="body" style={styles.descText}>
                        {entry.description}
                      </CustomText>

                      {entry.documentsUrl?.length > 0 &&
                        entry.documentsUrl.map((url, docIndex) => (
                          <Pressable
                            key={docIndex}
                            style={styles.comprobanteButton}
                            onPress={() => handleOpenDocument(url)}
                          >
                            <FileText size={12} color={theme.colors.secondary} />
                            <CustomText variant="caption" style={styles.comprobanteText}>
                              COMPROBANTE {entry.documentsUrl.length > 1 ? docIndex + 1 : ''}
                            </CustomText>
                          </Pressable>
                        ))}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.gray100,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    height: '92%',
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    color: theme.colors.black,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 18,
  },
  officialBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  smallGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#27ae60',
    marginRight: 6,
  },
  officialText: {
    color: theme.colors.gray500,
    fontFamily: theme.typography.fontFamily.medium,
  },
  closeButton: {
    padding: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  timelineRow: {
    flexDirection: 'row',
    minHeight: 200,
  },
  timelineLeftColumn: {
    width: 50,
    alignItems: 'center',
  },
  lineSegment: {
    flex: 1,
    width: 2,
    backgroundColor: theme.colors.gray400,
  },
  iconTimelineCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.gray200,
    elevation: 2,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginVertical: 4,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: 24,
    padding: 16,
    marginBottom: 20,
    marginLeft: 4,
    elevation: 1,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cardTitle: {
    color: theme.colors.black,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 18,
    marginBottom: 8,
  },
  completedBadge: {
    backgroundColor: '#DCFCE7',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  completedBadgeText: {
    color: '#15803D',
    fontFamily: theme.typography.fontFamily.bold,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: {
    color: theme.colors.gray600,
    fontFamily: theme.typography.fontFamily.medium,
    marginLeft: 6,
  },
  descText: {
    color: theme.colors.gray700,
    lineHeight: 18,
    marginBottom: 16,
  },
  comprobanteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.secondaryLight,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 4,
  },
  comprobanteText: {
    color: theme.colors.secondary,
    fontFamily: theme.typography.fontFamily.bold,
    marginLeft: 6,
  },
});
