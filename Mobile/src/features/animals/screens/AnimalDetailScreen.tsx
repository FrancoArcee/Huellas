import React, { useEffect, useMemo, useState } from 'react';
import {
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../../theme';
import { CustomText } from '../../../shared/components/ui/CustomText';
import ChevronBackSvg from '../../../assets/icons/buttons/chevronBack.svg';
import LikeIcon from '../../../assets/icons/like.svg';
import LocationSvg from '../../../assets/icons/location.svg';
import WhatsAppSvg from '../../../assets/icons/whatsapp.svg';
import { useWhatsApp } from '../../../shared/hooks/useWhatsApp';

const WHATSAPP_PLACEHOLDER = '5492215550123';

const animal = {
  id: 'rocky',
  name: 'Rocky',
  species: 'Perro',
  age: '2 años',
  gender: 'Macho',
  weight: '1.2 Kg',
  status: 'Castrado',
  location: 'La Plata',
  ownerName: 'Jorge Visconti',
  ownerRole: 'Dueño',
  ownerInitials: 'JV',
  whatsapp: WHATSAPP_PLACEHOLDER,
  imageUrl:
    'https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=900&q=85',
  description:
    'Soy un beagle curioso y muy compañero. Me encanta salir a pasear, olfatear todo y jugar. Soy sociable, cariñoso y disfruto estar acompañado. Necesito actividad diaria y un hogar donde me incluyan como parte de la familia',
};

const roundedFont = Platform.select({
  web: 'Nunito, Poppins, "Arial Rounded MT Bold", Arial, sans-serif',
  default: theme.typography.fontFamily.regular,
}) as string;

const roundedSemiBold = Platform.select({
  web: 'Nunito, Poppins, "Arial Rounded MT Bold", Arial, sans-serif',
  default: theme.typography.fontFamily.semiBold,
}) as string;

const roundedBold = Platform.select({
  web: 'Nunito, Poppins, "Arial Rounded MT Bold", Arial, sans-serif',
  default: theme.typography.fontFamily.bold,
}) as string;

interface Props {
  topInset?: number;
}

export const AnimalDetailScreen = ({ topInset = 0 }: Props) => {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [contacting, setContacting] = useState(false);
  const [backHovered, setBackHovered] = useState(false);
  const [likeHovered, setLikeHovered] = useState(false);
  const [whatsappHovered, setWhatsappHovered] = useState(false);
  const { openWhatsApp } = useWhatsApp();

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;

    const fontId = 'huellas-nunito-font';
    if (document.getElementById(fontId)) return;

    const link = document.createElement('link');
    link.id = fontId;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap';
    document.head.appendChild(link);
  }, []);

  const whatsappMessage = useMemo(
    () => `Hola, vi a ${animal.name} en Huellas y quisiera consultar por su adopción.`,
    [],
  );

  const handleContact = async () => {
    try {
      setContacting(true);
      await openWhatsApp({
        phoneNumber: animal.whatsapp,
        message: whatsappMessage,
      });
    } finally {
      setContacting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.contentShell}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ImageBackground
            source={{ uri: animal.imageUrl }}
            style={styles.hero}
            imageStyle={styles.heroImage}
            resizeMode="cover"
          >
            <View style={[styles.heroActions, { paddingTop: Math.max(topInset + 14, 42) }]}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Volver"
                onPress={() => router.back()}
                onHoverIn={() => setBackHovered(true)}
                onHoverOut={() => setBackHovered(false)}
                style={({ pressed }) => [
                  styles.iconButton,
                  (pressed || backHovered) && styles.iconButtonActive,
                ]}
              >
                <ChevronBackSvg width={11} height={14} />
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={liked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                accessibilityState={{ selected: liked }}
                onPress={() => setLiked((current) => !current)}
                onHoverIn={() => setLikeHovered(true)}
                onHoverOut={() => setLikeHovered(false)}
                style={({ pressed }) => [
                  styles.iconButton,
                  liked && styles.likeButtonSelected,
                  (pressed || likeHovered) && styles.iconButtonActive,
                ]}
              >
                <LikeIcon
                  width={25}
                  height={23}
                  fill={liked ? '#ff6b8a' : 'none'}
                  stroke={liked ? '#ff6b8a' : theme.colors.white}
                />
              </Pressable>
            </View>
          </ImageBackground>

          <View style={styles.body}>
            <View style={styles.titleCard}>
              <CustomText variant="h1" style={styles.title}>
                {animal.name}
              </CustomText>
              <CustomText variant="p" style={styles.subtitle}>
                {animal.species} · {animal.age}
              </CustomText>
            </View>

            <View style={styles.tagsRow}>
              <View style={styles.tag}>
                <CustomText style={styles.tagText}>{animal.gender}</CustomText>
              </View>
              <View style={styles.tag}>
                <CustomText style={styles.tagText}>{animal.weight}</CustomText>
              </View>
              <View style={styles.tag}>
                <CustomText style={styles.tagText}>{animal.status}</CustomText>
              </View>
            </View>

            <View style={styles.about}>
              <CustomText variant="h4" style={styles.sectionTitle}>
                Sobre {animal.name}
              </CustomText>
              <CustomText variant="p" style={styles.description}>
                {animal.description}
              </CustomText>
            </View>

            <View style={styles.locationRow}>
              <LocationSvg width={22} height={22} />
              <CustomText variant="p" style={styles.locationText}>
                {animal.location}
              </CustomText>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footerWrap}>
          <View style={styles.footer}>
            <View style={styles.avatar}>
              <CustomText style={styles.avatarText}>{animal.ownerInitials}</CustomText>
            </View>
            <CustomText variant="p" style={styles.ownerName} numberOfLines={1}>
              {animal.ownerName}
            </CustomText>
            <CustomText variant="p" style={styles.ownerRole}>
              {animal.ownerRole}
            </CustomText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Contactar por WhatsApp a ${animal.ownerName}`}
              accessibilityState={{ disabled: contacting }}
              disabled={contacting}
              onPress={handleContact}
              onHoverIn={() => setWhatsappHovered(true)}
              onHoverOut={() => setWhatsappHovered(false)}
              style={({ pressed }) => [
                styles.whatsappButton,
                (pressed || whatsappHovered) && !contacting && styles.whatsappButtonActive,
                contacting && styles.whatsappButtonDisabled,
              ]}
            >
              <WhatsAppSvg width={38} height={38} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  contentShell: {
    position: 'relative',
    flex: 1,
    width: '100%',
    backgroundColor: theme.colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 92,
  },
  hero: {
    width: '100%',
    height: 276,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 27,
  },
  iconButton: {
    width: 39,
    height: 39,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 67, 27, 0.75)',
  },
  iconButtonActive: {
    transform: [{ scale: 0.96 }],
    opacity: 0.88,
  },
  likeButtonSelected: {
    backgroundColor: 'rgba(52, 67, 27, 0.9)',
  },
  body: {
    width: '100%',
  },
  titleCard: {
    width: '82%',
    maxWidth: 314,
    minHeight: 61,
    marginTop: -31,
    alignSelf: 'center',
    borderRadius: 31,
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 28,
    paddingRight: 30,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  title: {
    color: theme.colors.black,
    fontFamily: roundedBold,
    fontSize: 29,
    fontWeight: '800',
    lineHeight: 35,
  },
  subtitle: {
    color: '#9B8EF2',
    fontFamily: roundedFont,
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 24,
  },
  tagsRow: {
    width: '80%',
    maxWidth: 302,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 17,
  },
  tag: {
    minWidth: 80,
    height: 22,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E7D3FF',
    paddingHorizontal: 12,
  },
  tagText: {
    color: '#9385E9',
    fontFamily: roundedBold,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
  },
  about: {
    marginTop: 32,
    paddingLeft: 40,
    paddingRight: 46,
  },
  sectionTitle: {
    color: theme.colors.black,
    fontFamily: roundedBold,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  description: {
    marginTop: 4,
    color: theme.colors.black,
    fontFamily: roundedFont,
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 26,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
    paddingLeft: 38,
  },
  locationText: {
    marginLeft: 7,
    color: '#4E4A4A',
    fontFamily: roundedFont,
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 24,
  },
  footerWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 20,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  footer: {
    width: '86%',
    maxWidth: 326,
    height: 50,
    borderRadius: 27,
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 17,
    paddingRight: 7,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 3,
    elevation: 4,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFC36B',
  },
  avatarText: {
    color: theme.colors.white,
    fontFamily: roundedSemiBold,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  ownerName: {
    flex: 1,
    marginLeft: 10,
    color: theme.colors.white,
    fontFamily: roundedFont,
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 24,
  },
  ownerRole: {
    marginLeft: 8,
    marginRight: 5,
    color: '#FFE0B0',
    fontFamily: roundedFont,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  whatsappButton: {
    width: 42,
    height: 42,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whatsappButtonActive: {
    transform: [{ scale: 0.94 }],
    opacity: 0.88,
  },
  whatsappButtonDisabled: {
    opacity: 0.45,
  },
});
