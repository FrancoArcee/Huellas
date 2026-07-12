import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { ShieldCheck, X } from 'lucide-react-native';
import { theme } from '../../../theme';
import { CustomText } from '../../../shared/components/ui/CustomText';
import { clinicalHistoryService } from '../../clinical-history/services/clinicalHistoryService';
import { ClinicalHistoryList } from '../../clinical-history/components/ClinicalHistoryList';
import type { ClinicalHistoryItem } from '@huellas/shared';

interface ClinicalHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  postId: string;
  petName: string;
}

export const ClinicalHistoryModal = ({
  visible,
  onClose,
  postId,
  petName,
}: ClinicalHistoryModalProps) => {
  const [items, setItems] = useState<ClinicalHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible || !postId) return;

    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await clinicalHistoryService.listByPost(postId);
        setItems(data);
      } catch (err) {
        console.error('Error fetching clinical history:', err);
        setError('No se pudo cargar el historial clínico.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [visible, postId]);

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
                  Historial Clínico de {petName}
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
          ) : items.length === 0 ? (
            <View style={styles.centered}>
              <CustomText variant="p" color="textSecondary" style={styles.errorText}>
                No hay registros en el historial clínico.
              </CustomText>
            </View>
          ) : (
            <View style={styles.listContainer}>
              <ClinicalHistoryList items={items} readOnly />
            </View>
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
  listContainer: {
    flex: 1,
    paddingBottom: 20,
  },
});
