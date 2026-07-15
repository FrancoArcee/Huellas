import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { theme } from '../../../theme';
import { CustomText } from '../../../shared/components/ui/CustomText';
import { CustomInput } from '../../../shared/components/ui/CustomInput';
import { CustomDropdown } from '../../../shared/components/ui/CustomDropdown';
import { Button } from '../../../shared/components/ui/Button';
import LogoSvg from '../../../assets/images/logo.svg';
import WhatsAppSvg from '../../../assets/icons/socialNetwork/whatsapp.svg';
import TelegramSvg from '../../../assets/icons/socialNetwork/telegram.svg';
import InstagramSvg from '../../../assets/icons/socialNetwork/instagram.svg';
import DiscordSvg from '../../../assets/icons/socialNetwork/discord.svg';
import FacebookSvg from '../../../assets/icons/socialNetwork/facebook.svg';
import MessengerSvg from '../../../assets/icons/socialNetwork/messenger.svg';
import { Link, useRouter } from 'expo-router';
import { useAuthStore } from '../../../shared/store/authStore';
import { validateContactByType, contactErrorMessages } from '@huellas/shared';
import { registerSchema } from '../validations/schemas';
import { User, Mail, Lock, MessageSquare } from 'lucide-react-native';
import { DismissKeyboard } from '../../../shared/components/ui/DismissKeyboard';

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


export const RegisterScreen = () => {
  const router = useRouter();
  const { signUp, isLoading } = useAuthStore();

  const [name, setName] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [contactValue, setContactValue] = useState<string>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    contactType?: string;
    contact?: string;
    email?: string;
    password?: string;
    acceptedTerms?: string;
    general?: string;
  }>({});

  const inputConfig = selectedPlatform ? PLATFORM_INPUT_CONFIG[selectedPlatform] : null;

  const validateField = (field: string, value: any) => {
    if (field === 'contact') {
      if (!validateContactByType(value, selectedPlatform)) {
        setErrors(prev => {
          const next = {
            ...prev,
            contact: contactErrorMessages[selectedPlatform] || "Contacto no válido"
          };
          delete next.general;
          return next;
        });
        return;
      }
    } else {
      const fieldSchema = (registerSchema.shape as any)[field];
      if (fieldSchema) {
        const result = fieldSchema.safeParse(value);
        if (!result.success) {
          setErrors(prev => {
            const next = {
              ...prev,
              [field]: result.error.issues[0]?.message
            };
            delete next.general;
            return next;
          });
          return;
        }
      }
    }

    // Limpiar error si pasa la validación
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

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    validateField('password', val);
  };

  const handleAcceptedTermsChange = (val: boolean) => {
    setAcceptedTerms(val);
    validateField('acceptedTerms', val);
  };

  const handleRegister = async () => {
    setErrors({});

    const formData = {
      name: name.trim(),
      email: email.trim(),
      password,
      contact: contactValue.trim(),
      contactType: selectedPlatform,
      acceptedTerms,
    };

    // Validar usando el esquema Zod de frontend
    const parsed = registerSchema.safeParse(formData);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const formattedErrors: any = {};
      for (const [key, value] of Object.entries(fieldErrors)) {
        formattedErrors[key] = value?.[0];
      }
      setErrors(formattedErrors);
      return;
    }

    try {
      await signUp({
        name: name.trim(),
        email: email.trim(),
        password,
        contact: contactValue.trim(),
        contactType: selectedPlatform,
      });
      // La redirección ocurrirá automáticamente por el Guard en RootLayout
    } catch (error: any) {
      console.error('Error al registrarse:', error);

      const status = error?.response?.status;
      const serverData = error?.response?.data;

      if (status === 400 && serverData?.errors) {
        // Errores de validación de Zod desde el servidor
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
          setErrors({ general: msg || 'Conflicto al crear la cuenta. Inténtalo de nuevo.' });
        }
      } else if (error?.message === 'Network Error') {
        setErrors({ general: 'Error de conexión. Verifica tu internet e intenta nuevamente.' });
      } else {
        setErrors({ general: serverData?.message || 'Error al crear la cuenta. Inténtalo de nuevo.' });
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <DismissKeyboard style={styles.innerContainer}>
          <View style={styles.header}>
            <LogoSvg width={80} height={80} />
            <CustomText variant="h1" color="primary" style={styles.appName}> Huellas </CustomText>
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
              label="Método de Contacto"
              placeholder="Seleccione un método de contacto"
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
                leftIcon={<MessageSquare size={24} color={theme.colors.gray500} />}
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
            <CustomInput
              label="Contraseña"
              placeholder="Mínimo 8 caracteres"
              secureTextEntry
              value={password}
              onChangeText={handlePasswordChange}
              error={errors.password}
              leftIcon={<Lock size={20} color={theme.colors.gray500} />}
            />

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => handleAcceptedTermsChange(!acceptedTerms)}
              activeOpacity={0.8}
            >
              <View style={[
                styles.checkbox,
                acceptedTerms && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
                errors.acceptedTerms ? { borderColor: theme.colors.danger } : {}
              ]}>
                {acceptedTerms && <CustomText variant="caption" color="white" style={styles.checkText}>✓</CustomText>}
              </View>
              <CustomText variant="caption" style={{ marginLeft: 10 }}>
                Acepto los términos y condiciones
              </CustomText>
            </TouchableOpacity>

            {errors.acceptedTerms && (
              <CustomText variant="caption" color="danger" style={styles.termsErrorText}>
                {errors.acceptedTerms}
              </CustomText>
            )}

            <Button
              title="Registrarme"
              loading={isLoading}
              disabled={isLoading}
              onPress={handleRegister}
            />

            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <CustomText variant="body" style={styles.footerText}>
                  Ya tenes cuenta? <CustomText variant="body" style={{ fontWeight: 'bold' }}>Inicia sesión</CustomText>
                </CustomText>
              </TouchableOpacity>
            </Link>
          </View>
        </DismissKeyboard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: { flex: 1, backgroundColor: theme.colors.background },
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { flexGrow: 1, paddingBottom: 40, paddingHorizontal: 24 },
  innerContainer: { width: '100%' },
  header: { alignItems: 'center', marginTop: 40, marginBottom: 20 },
  appName: { marginTop: 5, fontWeight: 'bold', color: theme.colors.primaryDark },
  form: { width: '100%' },
  checkboxContainer: { justifyContent: "center", flexDirection: 'row', alignItems: 'center', marginVertical: 15 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: theme.colors.gray400, alignItems: 'center', justifyContent: 'center' },
  checkText: { fontWeight: 'bold', fontSize: 11, includeFontPadding: false, lineHeight: 12 },
  termsErrorText: { color: theme.colors.danger, textAlign: 'center', marginBottom: 15, marginTop: -5 },
  footerText: { textAlign: 'center', marginTop: 20 },
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
});