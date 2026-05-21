import { useCallback } from 'react';
import { Linking } from 'react-native';

interface WhatsAppOptions {
  phoneNumber: string;
  message: string;
}

export const useWhatsApp = () => {
  const openWhatsApp = useCallback(async ({ phoneNumber, message }: WhatsAppOptions) => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    await Linking.openURL(url);
  }, []);

  return { openWhatsApp };
};
