import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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
import { Link } from 'expo-router';

const COMMUNICATION_OPTIONS = [
  { label: 'WhatsApp', value: 'WhatsApp', icon: WhatsAppSvg },
  { label: 'Telegram', value: 'Telegram', icon: TelegramSvg },
  { label: 'Instagram', value: 'Instagram', icon: InstagramSvg },
  { label: 'Discord', value: 'Discord', icon: DiscordSvg },
  { label: 'Facebook', value: 'Facebook', icon: FacebookSvg },
  { label: 'Messenger', value: 'Messenger', icon: MessengerSvg },
];

const PLATFORM_INPUT_CONFIG: Record<string, { label: string; placeholder: string }> = {
  WhatsApp:  { label: 'Número de WhatsApp', placeholder: 'Número de WhatsApp' },
  Telegram:  { label: 'Usuario de Telegram', placeholder: 'Usuario de Telegram' },
  Instagram: { label: 'Usuario de Instagram', placeholder: 'Usuario de Instagram' },
  Discord:   { label: 'Usuario de Discord', placeholder: 'Usuario de Discord' },
  Facebook:  { label: 'Usuario de Facebook', placeholder: 'Usuario de Facebook' },
  Messenger: { label: 'Usuario de Messenger', placeholder: 'Usuario de Messenger' },
};

export const RegisterScreen = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [contactValue, setContactValue] = useState<string>('');

  const inputConfig = selectedPlatform ? PLATFORM_INPUT_CONFIG[selectedPlatform] : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <LogoSvg width={80} height={80} />
        <CustomText variant="h1" color="primary" style={styles.appName}> Huellas </CustomText>
      </View>

      <View style={styles.form}>
        <CustomInput label="Nombre" placeholder="Nombre" />
        <CustomInput label="Apellido" placeholder="Apellido" />
        <CustomDropdown
          label="Medio de comunicación"
          placeholder="Seleccionar medio"
          options={COMMUNICATION_OPTIONS}
          selectedValue={selectedPlatform}
          onSelect={setSelectedPlatform}
        />
        {inputConfig && (
          <CustomInput
            label={inputConfig.label}
            placeholder={inputConfig.placeholder}
            value={contactValue}
            onChangeText={setContactValue}
          />
        )}
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
          href="/(tabs)"
        />

        <Link href="/(auth)/login" asChild>
          <TouchableOpacity>
            <CustomText variant="body" style={styles.footerText}>
              Ya tenes cuenta? <CustomText variant="body" style={{ fontWeight: 'bold' }}>Inicia sesión</CustomText>
            </CustomText>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, paddingHorizontal: 24 },
  header: { alignItems: 'center', marginTop: 40, marginBottom: 20 },
  appName: { marginTop: 5, fontWeight: 'bold', color: theme.colors.primaryDark },
  form: { width: '100%' },
  checkboxContainer: { justifyContent: "center", flexDirection: 'row', alignItems: 'center', marginVertical: 15 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: theme.colors.gray400 },
  footerText: { textAlign: 'center', marginTop: 20 }
});