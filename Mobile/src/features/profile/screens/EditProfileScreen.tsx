import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Camera, User, Mail, MessageSquare } from 'lucide-react-native';
import { DismissKeyboard } from '../../../shared/components/ui/DismissKeyboard';
import { theme } from '../../../theme';
import { CustomText } from '../../../shared/components/ui/CustomText';
import { CustomInput } from '../../../shared/components/ui/CustomInput';
import { CustomDropdown } from '../../../shared/components/ui/CustomDropdown';
import { SuccessCheckIcon } from '../../../shared/components/ui/SuccessCheckIcon';
import { FeedbackModal } from '../../../shared/components/ui/FeedbackModal';
import BackSvg from '../../../assets/icons/buttons/chevronBack.svg';
import ProfileSvg from '../../../assets/icons/screens/profile.svg';

import WhatsAppSvg from '../../../assets/icons/socialNetwork/whatsapp.svg';
import TelegramSvg from '../../../assets/icons/socialNetwork/telegram.svg';
import InstagramSvg from '../../../assets/icons/socialNetwork/instagram.svg';
import DiscordSvg from '../../../assets/icons/socialNetwork/discord.svg';
import FacebookSvg from '../../../assets/icons/socialNetwork/facebook.svg';
import MessengerSvg from '../../../assets/icons/socialNetwork/messenger.svg';

import { useAuthStore } from '../../../shared/store/authStore';
import { api } from '../../../shared/services/api';
import { storage } from '../../../shared/services/storage';
import { updateUserSchema, validateContactByType, contactErrorMessages } from '@huellas/shared';

const COMMUNICATION_OPTIONS = [
  { label: 'WhatsApp', value: 'WhatsApp', icon: WhatsAppSvg },
  { label: 'Telegram', value: 'Telegram', icon: TelegramSvg },
  { label: 'Instagram', value: 'Instagram', icon: InstagramSvg },
  { label: 'Discord', value: 'Discord', icon: DiscordSvg },
  { label: 'Facebook', value: 'Facebook', icon: FacebookSvg },
  { label: 'Messenger', value: 'Messenger', icon: MessengerSvg },
];

const PLATFORM_INPUT_CONFIG: Record<string, { label: string; placeholder: string }> = {
  WhatsApp: { label: 'Número de WhatsApp', placeholder: '+5491123456789' },
  Telegram: { label: 'Usuario de Telegram', placeholder: '@usuario' },
  Instagram: { label: 'Usuario de Instagram', placeholder: 'usuario' },
  Discord: { label: 'Usuario de Discord', placeholder: 'usuario' },
  Facebook: { label: 'Usuario de Facebook', placeholder: 'usuario' },
  Messenger: { label: 'Usuario de Messenger', placeholder: 'usuario' },
};


export const EditProfileScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user: authUser } = useAuthStore();

  const [initialLoading, setInitialLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [contactValue, setContactValue] = useState<string>('');
  const [email, setEmail] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alertError, setAlertError] = useState<{ title: string; message: string } | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      if (!authUser?.id) return;
      try {
        setInitialLoading(true);
        const res = await api.get(`/users/${authUser.id}`);
        const user = res.data.data;
        setName(user.name || '');
        setEmail(user.email || '');
        setSelectedPlatform(user.contactType || '');
        setContactValue(user.contact || '');
        setProfilePictureUrl(user.profilePictureUrl || null);
      } catch (err) {
        console.error('Error loading user profile in edit form:', err);
        // Fallback to auth store values
        setName(authUser.name || '');
        setEmail(authUser.email || '');
        setSelectedPlatform(authUser.contactType || '');
        setContactValue(authUser.contact || '');
        setProfilePictureUrl(authUser.profilePictureUrl || null);
      } finally {
        setInitialLoading(false);
      }
    };
    loadUserData();
  }, [authUser?.id]);

  const inputConfig = selectedPlatform ? PLATFORM_INPUT_CONFIG[selectedPlatform] : null;

  const validateField = (field: string, value: any) => {
    if (field === 'contact') {
      if (!validateContactByType(value, selectedPlatform)) {
        setErrors(prev => {
          const next = {
            ...prev,
            contact: contactErrorMessages[selectedPlatform] || "Contacto no válido"
          } as any;
          delete next.general;
          return next;
        });
        return;
      }
    } else {
      const fieldSchema = (updateUserSchema.shape as any)[field];
      if (fieldSchema) {
        const result = fieldSchema.safeParse(value);
        if (!result.success) {
          setErrors(prev => {
            const next = {
              ...prev,
              [field]: result.error.issues[0]?.message
            } as any;
            delete next.general;
            return next;
          });
          return;
        }
      }
    }

    // Clear error
    setErrors(prev => {
      const next = { ...prev };
      delete (next as any)[field];
      return next;
    });
  };

  const handleNameChange = (val: string) => {
    setName(val);
    validateField('name', val);
  };

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
    setErrors(prev => {
      const next = { ...prev };
      delete next.contactType;
      delete next.contact;
      return next;
    });
    if (contactValue) {
      if (!validateContactByType(contactValue, platform)) {
        setErrors(prev => ({
          ...prev,
          contact: contactErrorMessages[platform] || "Contacto no válido"
        }));
      }
    }
  };

  const handleContactValueChange = (val: string) => {
    setContactValue(val);
    validateField('contact', val.trim());
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    validateField('email', val.trim());
  };

  const handleSelectImage = () => {
    Alert.alert(
      'Foto de perfil',
      '¿De dónde deseas seleccionar tu foto de perfil?',
      [
        { text: 'Cámara', onPress: handleTakeCameraPhoto },
        { text: 'Galería', onPress: handlePickGalleryImage },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const handlePickGalleryImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setAlertError({ title: 'Permiso requerido', message: 'Necesitamos permiso para acceder a tu galería.' });
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0 && result.assets[0]) {
        const uri = result.assets[0].uri;
        if (uri) {
          await uploadImage(uri);
        }
      }
    } catch (error) {
      console.error('Error picking image from library:', error);
      setAlertError({ title: 'Error', message: 'No se pudo seleccionar la imagen de la galería.' });
    }
  };

  const handleTakeCameraPhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setAlertError({ title: 'Permiso requerido', message: 'Necesitamos permiso para acceder a tu cámara.' });
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0 && result.assets[0]) {
        const uri = result.assets[0].uri;
        if (uri) {
          await uploadImage(uri);
        }
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      setAlertError({ title: 'Error', message: 'No se pudo tomar la foto.' });
    }
  };

  const uploadImage = async (localUri: string) => {
    setUploadingImage(true);
    try {
      const filename = localUri.split('/').pop() || 'profile.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      const formData = new FormData();
      formData.append('image', {
        uri: localUri,
        name: filename,
        type,
      } as any);

      const response = await api.post('/users/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data?.success && response.data?.url) {
        setProfilePictureUrl(response.data.url);
      } else {
        throw new Error('Upload response was not successful');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setAlertError({ title: 'Error de subida', message: 'No se pudo subir la imagen al servidor.' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    setErrors({});
    if (!authUser?.id) return;

    const payload: any = {
      name: name.trim(),
      email: email.trim(),
      contact: contactValue.trim(),
      contactType: selectedPlatform,
    };

    if (profilePictureUrl) {
      payload.profilePictureUrl = profilePictureUrl;
    }

    // Validate using updateUserSchema
    const parsed = updateUserSchema.safeParse(payload);
    if (!parsed.success) {
      console.log('Validation errors on EditProfileScreen:', parsed.error.flatten().fieldErrors);
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const formattedErrors: any = {};
      for (const [key, value] of Object.entries(fieldErrors)) {
        formattedErrors[key] = value?.[0];
      }
      setErrors(formattedErrors);
      return;
    }

    try {
      setIsSaving(true);
      const response = await api.put(`/users/${authUser.id}`, payload);
      const updatedUser = response.data.data;

      // Update storage and store
      await storage.setUser(updatedUser);
      useAuthStore.setState({ user: updatedUser });

      setShowSuccess(true);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      const status = error?.response?.status;
      const serverData = error?.response?.data;

      if (status === 400 && serverData?.errors) {
        const formattedErrors: any = {};
        for (const [key, value] of Object.entries(serverData.errors)) {
          formattedErrors[key] = Array.isArray(value) ? value[0] : value;
        }
        setErrors(formattedErrors);
      } else if (status === 409) {
        const msg = serverData?.message || '';
        if (msg.includes('Email already in use') || msg.toLowerCase().includes('correo') || msg.toLowerCase().includes('email')) {
          setErrors({ email: 'El correo electrónico ya está registrado' });
        } else if (msg.includes('contacto ya está en uso') || msg.toLowerCase().includes('contacto')) {
          setErrors({ contact: 'El contacto ya está en uso por otro usuario' });
        } else {
          setErrors({ general: msg || 'Conflicto al actualizar el perfil.' });
        }
      } else {
        setErrors({ general: serverData?.message || 'Error al actualizar el perfil. Inténtalo de nuevo.' });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.back();
  };

  if (initialLoading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <DismissKeyboard style={[styles.screen, { paddingTop: insets.top }]}>
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
            {/* Foto de Perfil */}
            <View style={styles.avatarSection}>
              <TouchableOpacity style={styles.avatarContainer} onPress={handleSelectImage} activeOpacity={0.85}>
                {profilePictureUrl ? (
                  <Image source={{ uri: profilePictureUrl }} style={styles.avatarImage} />
                ) : (
                  <ProfileSvg width={78} height={78} color={theme.colors.primary} />
                )}
                <View style={styles.cameraIconContainer}>
                  {uploadingImage ? (
                    <ActivityIndicator size="small" color={theme.colors.white} />
                  ) : (
                    <Camera size={18} color={theme.colors.white} />
                  )}
                </View>
              </TouchableOpacity>
              <CustomText variant="caption" style={styles.avatarHint}>
                Presioná para cambiar tu foto
              </CustomText>
            </View>

            <View style={styles.form}>
              {errors.general && (
                <View style={styles.generalErrorBox}>
                  <CustomText variant="body" color="white" style={styles.generalErrorText}>
                    {errors.general}
                  </CustomText>
                </View>
              )}

              <CustomInput
                label="Nombre completo"
                placeholder="Nombre y Apellido"
                value={name}
                onChangeText={handleNameChange}
                error={errors.name}
                leftIcon={<User size={20} color={theme.colors.gray500} />}
              />

              <CustomDropdown
                label="Medio de comunicación"
                placeholder="Seleccionar medio"
                options={COMMUNICATION_OPTIONS}
                selectedValue={selectedPlatform}
                onSelect={handlePlatformChange}
                error={errors.contactType}
              />

              {inputConfig && (
                <CustomInput
                  label={inputConfig.label}
                  placeholder={inputConfig.placeholder}
                  value={contactValue}
                  onChangeText={handleContactValueChange}
                  error={errors.contact}
                  leftIcon={<MessageSquare size={20} color={theme.colors.gray500} />}
                />
              )}

              <CustomInput
                label="Correo electrónico"
                placeholder="correo@ejemplo.com"
                value={email}
                onChangeText={handleEmailChange}
                error={errors.email}
                leftIcon={<Mail size={20} color={theme.colors.gray500} />}
              />

              <TouchableOpacity
                style={styles.saveButton}
                activeOpacity={0.85}
                onPress={handleSave}
                disabled={isSaving || uploadingImage}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color={theme.colors.white} />
                ) : (
                  <CustomText variant="p" style={styles.saveButtonText}>
                    Actualizar perfil
                  </CustomText>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                activeOpacity={0.85}
                onPress={() => router.back()}
                disabled={isSaving}
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

          <FeedbackModal
            visible={!!alertError}
            type="error"
            title={alertError?.title || ''}
            message={alertError?.message || ''}
            onClose={() => setAlertError(null)}
          />
      </DismissKeyboard>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingTop: 64,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  avatarContainer: {
    width: 136,
    height: 136,
    borderRadius: 68,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarImage: {
    width: 136,
    height: 136,
    borderRadius: 68,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: theme.colors.primary,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: theme.colors.white,
  },
  avatarHint: {
    marginTop: theme.spacing.sm,
    color: theme.colors.gray500,
    fontFamily: theme.typography.fontFamily.medium,
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
    marginTop: theme.spacing.xl,
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
  generalErrorBox: {
    backgroundColor: theme.colors.danger,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  generalErrorText: {
    textAlign: 'center',
    fontWeight: 'bold',
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
export default EditProfileScreen;
