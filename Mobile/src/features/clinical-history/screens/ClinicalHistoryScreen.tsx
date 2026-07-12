// ───────────────────────────────────────────────
//  Clinical History Screen — Main screen for Clinical History feature
// ───────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useClinicalHistoryStore } from '../store/useClinicalHistory';
import { ClinicalHistoryList } from '../components/ClinicalHistoryList';
import { ClinicalHistoryFormModal } from '../components/ClinicalHistoryFormModal';
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal';
import { SuccessCheckIcon } from '../../../shared/components/ui/SuccessCheckIcon';
import type { ClinicalHistoryItem } from '@huellas/shared';
import { colors } from '../../../theme/index';
import type { ClinicalHistoryPayload } from '../services/clinicalHistoryService';

export function ClinicalHistoryScreen() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const router = useRouter();

  const {
    items,
    isLoading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  } = useClinicalHistoryStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ClinicalHistoryItem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [itemToDelete, setItemToDelete] = useState<ClinicalHistoryItem | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleEditItem = (item: ClinicalHistoryItem) => {
    setEditingItem(item);
    setModalVisible(true);
  };

  const handleDeleteItem = (item: ClinicalHistoryItem) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!postId || !itemToDelete) return;
    try {
      await deleteItem(postId, itemToDelete.id);
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (err) {
      Alert.alert('Error', 'No se pudo eliminar el registro.');
    }
  };

  const handleFormSubmit = async (data: {
    type: string;
    name: string;
    date: string;
    veterinary: string;
    veterinarian: string;
    description?: string | undefined;
    file: any;
  }) => {
    if (!postId) return;

    // Convert date string "DD/MM/YYYY" to ISO format
    const [day, month, year] = data.date.split('/').map(Number);
    const isoDate = new Date(Date.UTC(year!, month! - 1, day!)).toISOString();

    const payload: ClinicalHistoryPayload = {
      type: data.type,
      name: data.name,
      date: isoDate,
      veterinary: data.veterinary,
      veterinarian: data.veterinarian,
    };

    if (data.description !== undefined) {
      payload.description = data.description;
    }

    if (editingItem) {
      try {
        await updateItem(postId, editingItem.id, payload, data.file);
        setSuccessMessage('Tu registro se actualizó con éxito');
        setShowSuccessModal(true);
      } catch (err) {
        Alert.alert('Error', 'No se pudo actualizar el registro.');
      }
    } else {
      try {
        await createItem(postId, payload, data.file);
        setSuccessMessage('Tu registro se guardó correctamente');
        setShowSuccessModal(true);
      } catch (err) {
        Alert.alert('Error', 'No se pudo agregar el registro.');
      }
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* Header bar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ChevronLeft width={28} height={28} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historial Clínico</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {isLoading && items.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollViewContent
          items={items}
          onEditItem={handleEditItem}
          onDeleteItem={handleDeleteItem}
          error={error}
        />
      )}

      {/* Bottom Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            setEditingItem(null);
            setModalVisible(true);
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.addBtnText}>Agregar nuevo registro</Text>
        </TouchableOpacity>


      </View>

      {/* Add / Edit Form Modal */}
      <ClinicalHistoryFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleFormSubmit}
        editingItem={editingItem}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        visible={showDeleteModal}
        title="¿Estás seguro que deseas eliminar este registro clínico?"
        message=""
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

      {/* Success Update Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.successOverlay}>
          <Pressable style={styles.successBackdrop} onPress={() => setShowSuccessModal(false)} />
          <View style={styles.successDialog}>
            <View style={styles.successIconContainer}>
              <SuccessCheckIcon size={80} />
            </View>
            <Text style={styles.successTitle}>
              {successMessage}
            </Text>
            <TouchableOpacity
              style={styles.successButton}
              activeOpacity={0.85}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.successButtonText}>
                Aceptar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Separated component for Scroll content to prevent fast rendering lag
function ScrollViewContent({
  items,
  onEditItem,
  onDeleteItem,
  error,
}: {
  items: any[];
  onEditItem: (item: any) => void;
  onDeleteItem: (item: any) => void;
  error: string | null;
}) {
  return (
    <View style={styles.content}>
      <Text style={styles.sectionTitle}>Historial registrado</Text>

      {error && <Text style={styles.errorBanner}>{error}</Text>}

      <View style={styles.listWrapper}>
        <ClinicalHistoryList
          items={items}
          onEditItem={onEditItem}
          onDeleteItem={onDeleteItem}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F3F3', // Light gray background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
  },
  headerPlaceholder: {
    width: 36,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  errorBanner: {
    color: colors.danger,
    fontSize: 14,
    marginBottom: 12,
    fontWeight: '500',
  },
  listWrapper: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
    gap: 16,
    backgroundColor: 'transparent',
  },
  addBtn: {
    backgroundColor: colors.black,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  addBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  saveBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Modal de éxito
  successOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  successBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    opacity: 0.55,
  },
  successDialog: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    overflow: 'hidden',
  },
  successIconContainer: {
    marginBottom: 16,
  },
  successTitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: colors.black,
    fontSize: 20,
    fontWeight: '600',
  },
  successButton: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
});
