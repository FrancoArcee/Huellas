import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../../../theme';
import { CustomText } from '../../../shared/components/ui/CustomText';
import { CustomInput } from '../../../shared/components/ui/CustomInput';
import { Button } from '../../../shared/components/ui/Button';
import LogoSvg from '../../../assets/images/logo.svg';

export const RegisterScreen = ({ navigation }: any) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <LogoSvg width={80} height={80} />
        <CustomText variant="h1" color="primary" style={styles.appName}> Huellas </CustomText>
      </View>

      <View style={styles.form}>
        <CustomInput label="Nombre" placeholder="Nombre" />
        <CustomInput label="Apellido" placeholder="Apellido" />
        <CustomInput label="Correo electrónico" placeholder="Correo electrónico" />
        <CustomInput label="Contraseña" placeholder="Contraseña" secureTextEntry />

        <View style={styles.checkboxContainer}>
          <View style={styles.checkbox} /> 
          <CustomText variant="caption" style={{ marginLeft: 10 }}>
            Acepto los términos y condiciones
          </CustomText>
        </View>

        <Button 
          title="Registrarme" 
          onPress={() => {}} 
        />

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <CustomText variant="body" style={styles.footerText}>
            Ya tenes cuenta? <CustomText variant="body" style={{ fontWeight: 'bold' }}>Inicia sesión</CustomText>
          </CustomText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, paddingHorizontal: 24 },
  header: { alignItems: 'center', marginTop: 40, marginBottom: 20 },
  appName: { marginTop: 5, fontWeight: 'bold' },
  form: { width: '100%' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 15 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: theme.colors.gray400 },
  footerText: { textAlign: 'center', marginTop: 20 }
});