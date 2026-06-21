import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  ScrollView, 
  TouchableWithoutFeedback, 
  Keyboard, 
  Platform 
} from 'react-native';
import { theme } from '../../../theme';
import { CustomText } from '../../../shared/components/ui/CustomText';
import { CustomInput } from '../../../shared/components/ui/CustomInput';
import { Button } from '../../../shared/components/ui/Button';
import LogoSvg from '../../../assets/images/logo.svg';
import GoogleSvg from '../../../assets/icons/google.svg';
import { Link, useRouter } from 'expo-router';
import { useAuthStore } from '../../../shared/store/authStore';
import { loginSchema } from '../validations/schemas';
import { Mail, Lock } from 'lucide-react-native';

export const LogInScreen = () => {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validateField = (field: 'email' | 'password', value: string) => {
    const result = loginSchema.shape[field].safeParse(value);
    if (!result.success) {
      setErrors(prev => {
        const next = {
          ...prev,
          [field]: result.error.issues[0]?.message,
        };
        delete next.general; // Limpiar error general al escribir
        return next;
      });
    } else {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    validateField('email', val.trim());
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    validateField('password', val);
  };

  const handleLogin = async () => {
    setErrors({});
    
    // Validar todo el esquema al enviar
    const result = loginSchema.safeParse({ email: email.trim(), password });
    
    if (!result.success) {
      const fieldErrors: any = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0]] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await login(email.trim(), password);
      // La redirección ocurrirá automáticamente por el Guard en RootLayout
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      
      const serverMessage = error?.response?.data?.message || '';
      const serverCode = error?.response?.data?.code || error?.response?.data?.error || '';
      
      if (serverCode === 'INVALID_EMAIL_OR_PASSWORD' || serverMessage.includes('Invalid credentials') || serverMessage.includes('invalid email or password')) {
        setErrors({ general: 'Correo electrónico o contraseña incorrectos' });
      } else if (error?.message === 'Network Error') {
        setErrors({ general: 'Error de conexión. Verifica tu internet e intenta nuevamente.' });
      } else {
        setErrors({ general: serverMessage || 'Error al iniciar sesión. Inténtalo de nuevo.' });
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <View style={styles.header}>
              <LogoSvg width={100} height={100} />
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
                label="Correo electrónico"
                placeholder="correo@ejemplo.com"
                value={email}
                onChangeText={handleEmailChange}
                error={errors.email}
                leftIcon={<Mail size={20} color={theme.colors.gray500} />}
              />
              <CustomInput
                label="Contraseña"
                placeholder="********"
                secureTextEntry
                value={password}
                onChangeText={handlePasswordChange}
                error={errors.password}
                leftIcon={<Lock size={20} color={theme.colors.gray500} />}
              />

              <Button
                title="Iniciar Sesión"
                loading={isLoading}
                disabled={isLoading}
                onPress={handleLogin}
                style={styles.loginButton}
              />

              <Link href="/(auth)/register" asChild>
                <TouchableOpacity>
                  <CustomText variant="body" style={styles.footerText}>
                    No tenes cuenta? <CustomText variant="body" style={{ fontWeight: 'bold' }}>Regístrate</CustomText>
                  </CustomText>
                </TouchableOpacity>
              </Link>

              <View style={styles.separatorContainer}>
                <View style={styles.line} />
                <View style={styles.dot} />
                <View style={styles.line} />
              </View>

              <Button
                title="Continuar con Google"
                icon={GoogleSvg}
                iconPosition='left'
                onPress={() => router.push('/(tabs)')}
                style={styles.googleButton}
                textColor={theme.colors.black}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { flexGrow: 1, justifyContent: 'center' },
  innerContainer: { padding: 24 },
  header: { alignItems: 'center', marginTop: 20, marginBottom: 30 },
  appName: { marginTop: 10, fontWeight: 'bold', color: theme.colors.primaryDark },
  form: { width: '100%' },
  loginButton: { marginTop: 10 },
  footerText: { textAlign: 'center', marginTop: 20 },
  separatorContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
  line: { flex: 1, height: 1, backgroundColor: theme.colors.gray400 },
  dot: { width: 8, height: 8, borderRadius: 4, borderWidth: 1, borderColor: theme.colors.gray400, marginHorizontal: 10 },
  googleButton: { backgroundColor: theme.colors.gray100, borderColor: theme.colors.gray400, borderWidth: 1 },
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
