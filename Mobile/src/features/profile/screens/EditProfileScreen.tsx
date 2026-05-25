import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../../theme';
import { CustomText } from '../../../shared/components/ui/CustomText';
import { CustomInput } from '../../../shared/components/ui/CustomInput';
import { SuccessCheckIcon } from '../../../shared/components/ui/SuccessCheckIcon';
import BackSvg from '../../../assets/icons/buttons/chevronBack.svg';

// Mock del usuario (debe coincidir con ProfileScreen)
const MOCK_USER = {
  name: 'Carlos',
  lastName: 'Rodriguez',
  email: 'carlos@gmail.com',
  whatsapp: '+54 221 555 -1234',
};

export const EditProfileScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState(MOCK_USER.name);
  const [lastName, setLastName] = useState(MOCK_USER.lastName);
  const [email, setEmail] = useState(MOCK_USER.email);
  const [whatsapp, setWhatsapp] = useState(MOCK_USER.whatsapp);

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    // Simular guardado y mostrar modal de éxito
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.back();
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Botón volver */}
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 12 }]}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <BackSvg width={20} height={20} />
      </TouchableOpacity>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <CustomInput
            label="Nombre"
            placeholder="Nombre"
            value={name}
            onChangeText={setName}
          />
          <CustomInput
            label="Apellido"
            placeholder="Apellido"
            value={lastName}
            onChangeText={setLastName}
          />
          <CustomInput
            label="Correo electrónico"
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
          />
          <CustomInput
            label="WhatsApp"
            placeholder="+54 221 555 -1234"
            value={whatsapp}
            onChangeText={setWhatsapp}
          />

          <TouchableOpacity
            style={styles.saveButton}
            activeOpacity={0.85}
            onPress={handleSave}
          >
            <CustomText variant="p" style={styles.saveButtonText}>
              Actualizar perfil
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            activeOpacity={0.85}
            onPress={() => router.back()}
          >
            <CustomText variant="p" style={styles.cancelButtonText}>
              Cancelar
            </CustomText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de éxito */}
      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
        onRequestClose={handleSuccessClose}
      >
        <View style={styles.successOverlay}>
          <Pressable style={styles.successBackdrop} onPress={handleSuccessClose} />
          <View style={styles.successDialog}>
            <View style={styles.successIconContainer}>
              <SuccessCheckIcon size={80} />
            </View>
            <CustomText variant="h4" style={styles.successTitle}>
              Tu perfil fue actualizado con éxito!
            </CustomText>
            <TouchableOpacity
              style={styles.successButton}
              activeOpacity={0.85}
              onPress={handleSuccessClose}
            >
              <CustomText variant="p" style={styles.successButtonText}>
                Aceptar
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  backButton: {
    position: 'absolute',
    left: theme.spacing['2xl'],
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#767676',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing['2xl'],
    paddingTop: 80,
  },
  form: {
    width: '100%',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 100,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  saveButtonText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  cancelButton: {
    backgroundColor: '#2C2C2C',
    borderRadius: 100,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  // Modal de éxito
  successOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing['3xl'],
  },
  successBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.black,
    opacity: 0.55,
  },
  successDialog: {
    width: '100%',
    backgroundColor: theme.colors.white,
    borderRadius: 24,
    paddingVertical: theme.spacing['2xl'],
    paddingHorizontal: theme.spacing['2xl'],
    alignItems: 'center',
    overflow: 'hidden',
  },
  successIconContainer: {
    marginBottom: theme.spacing.lg,
  },
  successTitle: {
    textAlign: 'center',
    marginBottom: theme.spacing['2xl'],
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  successButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 100,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing['4xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  successButtonText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
});
