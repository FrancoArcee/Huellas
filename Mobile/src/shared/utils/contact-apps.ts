import { Linking } from 'react-native';

interface ContactAppOptions {
  contact: string;
  contactType: string;
  message: string;
}

const normalizeUsername = (contact: string) => contact.trim().replace(/^@/, '');

export const getContactAppUrl = ({
  contact,
  contactType,
  message,
}: ContactAppOptions): string | null => {
  const normalizedContact = normalizeUsername(contact);

  switch (contactType) {
    case 'WhatsApp': {
      const phoneNumber = contact.replace(/\D/g, '');
      return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    }
    case 'Telegram':
      return `https://t.me/${normalizedContact}`;
    case 'Instagram':
      return `https://www.instagram.com/${normalizedContact}/`;
    case 'Facebook':
      return /^https?:\/\//i.test(contact)
        ? contact.trim()
        : `https://www.facebook.com/${normalizedContact}`;
    case 'Messenger':
      return `https://m.me/${normalizedContact}`;
    case 'Discord':
    default:
      return null;
  }
};

export const openContactApp = async (options: ContactAppOptions): Promise<boolean> => {
  const url = getContactAppUrl(options);

  if (!url) {
    return false;
  }

  await Linking.openURL(url);
  return true;
};
