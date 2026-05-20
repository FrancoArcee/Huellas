import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Link } from 'expo-router';
import { theme } from '../../../theme';
import { CustomText } from '../../../shared/components/ui/CustomText';
import { CustomInput } from '../../../shared/components/ui/CustomInput';
import { Button } from '../../../shared/components/ui/Button';
import LogoSvg from '../../../assets/images/logo.svg';
import GoogleSvg from '../../../assets/icons/google.svg';

export const LogInScreen = () => {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <LogoSvg width={96} height={96} />
            <CustomText variant="h1" color="primary" style={styles.appName}>
              Huellas
            </CustomText>
          </View>

          <View style={styles.form}>
            <CustomInput
              label="Correo electrónico"
              placeholder="Correo electrónico"
              style={styles.inputGroup}
              labelStyle={styles.inputLabel}
              inputStyle={styles.input}
            />
            <CustomInput
              label="Contraseña"
              placeholder="Contraseña"
              secureTextEntry
              style={styles.inputGroup}
              labelStyle={styles.inputLabel}
              inputStyle={styles.input}
            />

            <Button title="Iniciar Sesión" href="/(tabs)" style={styles.loginButton} />

            <Link href="/(auth)/register" asChild>
              <TouchableOpacity style={styles.registerLink}>
                <CustomText variant="body" style={styles.footerText}>
                  No tenes cuenta?{' '}
                  <CustomText variant="body" style={styles.footerTextBold}>
                    Registrate
                  </CustomText>
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
              iconPosition="left"
              iconSize={18}
              onPress={() => { }}
              disabled={true}
              style={styles.googleButton}
              textColor={theme.colors.black}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  content: {
    width: '100%',
    maxWidth: 344,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  appName: {
    marginTop: 4,
    color: theme.colors.primaryDark,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 29,
    lineHeight: 35,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 30,
  },
  inputLabel: {
    marginBottom: 5,
    paddingLeft: 15,
    color: theme.colors.black,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 20,
    lineHeight: 27,
  },
  input: {
    height: 40,
    borderColor: theme.colors.black,
    borderWidth: 1,
    backgroundColor: '#E9E5E1',
    paddingHorizontal: 15,
    paddingVertical: 7,
    fontSize: 14,
    lineHeight: 20,
  },
  loginButton: {
    height: 50,
    marginTop: 3,
    backgroundColor: theme.colors.primary,
    paddingVertical: 0,
  },
  registerLink: {
    alignItems: 'center',
  },
  footerText: {
    marginTop: 18,
    textAlign: 'center',
    color: theme.colors.gray700,
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: 14,
  },
  footerTextBold: {
    color: theme.colors.gray700,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 14,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    width: '73%',
    marginTop: 34,
    marginBottom: 35,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.gray600,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: theme.colors.gray600,
    marginHorizontal: 15,
    backgroundColor: theme.colors.background,
  },
  googleButton: {
    height: 41,
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.black,
    borderWidth: 1,
    paddingVertical: 0,
  },
});
