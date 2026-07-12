// ───────────────────────────────────────────────
//  Clinical History Form Modal — Modal form to create or edit records
// ───────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { X, ChevronDown, Upload, FileText, Trash2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import type { ImagePickerAsset } from 'expo-image-picker';
import type { ClinicalHistoryItem } from '@huellas/shared';
import { colors } from '../../../theme/index';

interface ClinicalHistoryFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    type: string;
    name: string;
    date: string; // DD/MM/YYYY for input
    veterinary: string;
    veterinarian: string;
    description?: string | undefined;
    file: ImagePickerAsset | string; // New asset or existing URL
  }) => Promise<void>;
  editingItem: ClinicalHistoryItem | null;
}

const TYPE_OPTIONS = [
  { value: 'VACUNACION', label: 'Vacunación' },
  { value: 'DESPARASITACION', label: 'Desparasitación' },
  { value: 'CHEQUEO_PREVENTIVO', label: 'Chequeo preventivo' },
  { value: 'OTRO', label: 'Otro' },
];

export function ClinicalHistoryFormModal({
  visible,
  onClose,
  onSubmit,
  editingItem,
}: ClinicalHistoryFormModalProps) {
  const [type, setType] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [veterinary, setVeterinary] = useState('');
  const [veterinarian, setVeterinarian] = useState('');
  const [description, setDescription] = useState('');
  const [comprobante, setComprobante] = useState<ImagePickerAsset | string | null>(null);

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to format ISO Date to DD/MM/YYYY
  const formatIsoToInput = (isoString: string) => {
    try {
      const d = new Date(isoString);
      if (Number.isNaN(d.getTime())) return '';
      return [
        String(d.getUTCDate()).padStart(2, '0'),
        String(d.getUTCMonth() + 1).padStart(2, '0'),
        d.getUTCFullYear(),
      ].join('/');
    } catch {
      return '';
    }
  };

  // Pre-fill form if editing
  useEffect(() => {
    if (editingItem) {
      setType(editingItem.type);
      setName(editingItem.name || '');
      setDate(formatIsoToInput(editingItem.date));
      setVeterinary(editingItem.veterinary);
      setVeterinarian(editingItem.veterinarian);
      setDescription(editingItem.description || '');
      setComprobante(editingItem.comprobante);
    } else {
      // Clear form
      setType('');
      setName('');
      setDate('');
      setVeterinary('');
      setVeterinarian('');
      setDescription('');
      setComprobante(null);
    }
    setErrors({});
    setShowDropdown(false);
  }, [editingItem, visible]);

  const handleSelectType = (option: string) => {
    setType(option);
    setShowDropdown(false);
    setErrors((prev) => ({ ...prev, type: '' }));
  };

  const handlePickDocument = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permiso requerido', 'Necesitamos permiso para acceder a tu galería.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: false,
      mediaTypes: ['images'],
      quality: 1,
      preferredAssetRepresentationMode:
        ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
    });

    if (result.canceled || !result.assets[0]) return;

    setComprobante(result.assets[0]);
    setErrors((prev) => ({ ...prev, comprobante: '' }));
  };

  const handleRemoveComprobante = () => {
    setComprobante(null);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!type) {
      newErrors.type = 'Seleccioná el tipo de registro';
    }

    if (!name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!date) {
      newErrors.date = 'La fecha es requerida';
    } else if (!dateRegex.test(date)) {
      newErrors.date = 'Formato inválido (DD/MM/YYYY)';
    } else {
      // Check if valid date
      const [day, month, year] = date.split('/').map(Number);
      const testDate = new Date(year!, month! - 1, day!);
      if (
        testDate.getFullYear() !== year ||
        testDate.getMonth() !== month! - 1 ||
        testDate.getDate() !== day
      ) {
        newErrors.date = 'Fecha inválida';
      }
    }

    if (!veterinary.trim()) {
      newErrors.veterinary = 'La veterinaria es requerida';
    }

    if (!veterinarian.trim()) {
      newErrors.veterinarian = 'El veterinario es requerido';
    }

    if (!comprobante) {
      newErrors.comprobante = 'El comprobante es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        type,
        name: name.trim(),
        date,
        veterinary: veterinary.trim(),
        veterinarian: veterinarian.trim(),
        description: description.trim() || undefined,
        file: comprobante!,
      });
      onClose();
    } catch (error) {
      console.error('Error submitting clinical history item:', error);
      Alert.alert('Error', 'Hubo un error al guardar el registro.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <X width={24} height={24} color={colors.black} />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Tipo Field */}
              <Text style={styles.label}>
                Tipo <Text style={styles.asterisk}>*</Text>
              </Text>
              <TouchableOpacity
                style={[styles.input, styles.dropdownTrigger, errors.type ? styles.inputError : {}]}
                onPress={() => setShowDropdown(!showDropdown)}
                activeOpacity={0.8}
              >
                <Text style={type ? styles.inputText : styles.placeholderText}>
                  {TYPE_OPTIONS.find(o => o.value === type)?.label || 'Seleccioná el tipo'}
                </Text>
                <ChevronDown width={20} height={20} color={colors.gray600} />
              </TouchableOpacity>
              {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}

              {/* Dropdown Options */}
              {showDropdown && (
                <View style={styles.dropdownContainer}>
                  {TYPE_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={styles.dropdownOption}
                      onPress={() => handleSelectType(option.value)}
                    >
                      <Text style={styles.dropdownOptionText}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Nombre Field */}
              <Text style={styles.label}>
                Nombre <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.name ? styles.inputError : {}]}
                placeholder="Ej. Antirrábica, Séxtuple, Control anual"
                placeholderTextColor={colors.gray400}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                }}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

              {/* Fecha Field */}
              <Text style={styles.label}>
                Fecha <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.date ? styles.inputError : {}]}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={colors.gray400}
                value={date}
                onChangeText={(text) => {
                  const cleaned = text.replace(/\D/g, '');
                  let formatted = cleaned;
                  if (cleaned.length > 2) {
                    formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
                  }
                  if (cleaned.length > 4) {
                    formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
                  }
                  setDate(formatted);
                  if (errors.date) setErrors((prev) => ({ ...prev, date: '' }));
                }}
                keyboardType="numeric"
                maxLength={10}
              />
              {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}

              {/* Veterinaria Field */}
              <Text style={styles.label}>
                Veterinaria <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.veterinary ? styles.inputError : {}]}
                placeholder="Nombre veterinaria"
                placeholderTextColor={colors.gray400}
                value={veterinary}
                onChangeText={(text) => {
                  setVeterinary(text);
                  if (errors.veterinary) setErrors((prev) => ({ ...prev, veterinary: '' }));
                }}
              />
              {errors.veterinary && <Text style={styles.errorText}>{errors.veterinary}</Text>}

              {/* Veterinario Field */}
              <Text style={styles.label}>
                Veterinario <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.veterinarian ? styles.inputError : {}]}
                placeholder="Nombre y Apellido"
                placeholderTextColor={colors.gray400}
                value={veterinarian}
                onChangeText={(text) => {
                  setVeterinarian(text);
                  if (errors.veterinarian) setErrors((prev) => ({ ...prev, veterinarian: '' }));
                }}
              />
              {errors.veterinarian && <Text style={styles.errorText}>{errors.veterinarian}</Text>}

              {/* Comprobante Field */}
              <Text style={styles.label}>
                Comprobante <Text style={styles.asterisk}>*</Text>
              </Text>
              {!comprobante ? (
                <TouchableOpacity
                  style={[styles.uploadContainer, errors.comprobante ? styles.inputError : {}]}
                  onPress={handlePickDocument}
                  activeOpacity={0.8}
                >
                  <Upload width={20} height={20} color={colors.gray500} style={styles.uploadIcon} />
                  <Text style={styles.uploadText}>Subir archivo</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.comprobanteWrapper}>
                  {typeof comprobante === 'string' || comprobante.mimeType?.startsWith('image/') || comprobante.uri ? (
                    <View style={styles.previewContainer}>
                      <Image
                        source={{ uri: typeof comprobante === 'string' ? comprobante : comprobante.uri }}
                        style={styles.imagePreview}
                      />
                      <Text style={styles.filenameText} numberOfLines={1}>
                        {typeof comprobante === 'string'
                          ? 'Comprobante cargado'
                          : comprobante.fileName || 'imagen.jpg'}
                      </Text>
                      <TouchableOpacity onPress={handleRemoveComprobante} style={styles.removeBtn}>
                        <Trash2 width={18} height={18} color={colors.danger} />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.previewContainer}>
                      <FileText width={24} height={24} color={colors.gray600} />
                      <Text style={styles.filenameText} numberOfLines={1}>
                        Archivo adjunto
                      </Text>
                      <TouchableOpacity onPress={handleRemoveComprobante} style={styles.removeBtn}>
                        <Trash2 width={18} height={18} color={colors.danger} />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
              {errors.comprobante && <Text style={styles.errorText}>{errors.comprobante}</Text>}

              {/* Descripcion Field */}
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descripción"
                placeholderTextColor={colors.gray400}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.submitBtn, isSubmitting ? styles.submitBtnDisabled : {}]}
                onPress={handleSave}
                activeOpacity={0.8}
                disabled={isSubmitting}
              >
                <Text style={styles.submitBtnText}>
                  {isSubmitting
                    ? 'Guardando...'
                    : editingItem
                    ? 'Guardar cambios'
                    : 'Agregar registro'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  keyboardView: {
    maxHeight: '90%',
    width: '100%',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 42 : 24,
  },
  header: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  closeBtn: {
    padding: 8,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  asterisk: {
    color: colors.primary,
  },
  input: {
    backgroundColor: '#EAEAEA',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: colors.danger,
    borderWidth: 1,
  },
  inputText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  placeholderText: {
    fontSize: 14,
    color: colors.gray400,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownContainer: {
    backgroundColor: '#EAEAEA',
    borderRadius: 16,
    marginTop: 4,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  dropdownOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  dropdownOptionText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  customTypeContainer: {
    marginTop: 10,
  },
  uploadContainer: {
    backgroundColor: '#EAEAEA',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.gray400,
  },
  uploadIcon: {
    marginRight: 8,
  },
  uploadText: {
    fontSize: 14,
    color: colors.gray600,
    fontWeight: '500',
  },
  comprobanteWrapper: {
    marginTop: 4,
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gray200,
    padding: 8,
  },
  imagePreview: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 10,
  },
  filenameText: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
  },
  removeBtn: {
    padding: 8,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    marginTop: 4,
    marginLeft: 4,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
