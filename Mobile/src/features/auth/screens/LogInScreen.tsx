import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../../theme';
import { CustomText } from '../../../shared/components/ui/CustomText';
import { CustomInput } from '../../../shared/components/ui/CustomInput';
import { Button } from '../../../shared/components/ui/Button';
import LogoSvg from '../../../assets/images/logo.svg';
import GoogleSvg from '../../../assets/icons/google.svg';
import { Link } from 'expo-router';

export const LogInScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <LogoSvg width={100} height={100} />
        <CustomText variant="h1" color="primary" style={styles.appName}> Huellas </CustomText>
      </View>

      <View style={styles.form}>
        <CustomInput
          label="Correo electrónico"
          placeholder="Correo electrónico"
        />
        <CustomInput
          label="Contraseña"
          placeholder="Contraseña"
          secureTextEntry
        />

        <Button
          title="Iniciar Sesión"
          href="/(tabs)"
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
          onPress={() => { }}
          disabled={true}
          style={styles.googleButton}
          textColor={theme.colors.black}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: 24 },
  header: { alignItems: 'center', marginTop: 40, marginBottom: 30 },
  appName: { marginTop: 10, fontWeight: 'bold', color: theme.colors.primaryDark },
  form: { width: '100%' },
  loginButton: { marginTop: 10 },
  footerText: { textAlign: 'center', marginTop: 20 },
  separatorContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
  line: { flex: 1, height: 1, backgroundColor: theme.colors.gray400 },
  dot: { width: 8, height: 8, borderRadius: 4, borderWidth: 1, borderColor: theme.colors.gray400, marginHorizontal: 10 },
  googleButton: { backgroundColor: theme.colors.gray100, borderColor: theme.colors.gray400, borderWidth: 1 }
});