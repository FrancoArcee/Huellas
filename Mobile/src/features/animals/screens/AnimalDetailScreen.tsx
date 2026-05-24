import React, { useEffect, useMemo, useState } from 'react';
import {
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { theme } from '../../../theme';
import { CustomText } from '../../../shared/components/ui/CustomText';
import ChevronBackSvg from '../../../assets/icons/buttons/chevronBack.svg';
import LikeIcon from '../../../assets/icons/like.svg';
import LocationSvg from '../../../assets/icons/location.svg';
import WhatsAppSvg from '../../../assets/icons/whatsapp.svg';
import { useWhatsApp } from '../../../shared/hooks/useWhatsApp';
import { animalMocks } from '../../../mocks/animalsMocks';

const WHATSAPP_PLACEHOLDER = '5492215550123';

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
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const [liked, setLiked] = useState(false);
  const [contacting, setContacting] = useState(false);
  const [backHovered, setBackHovered] = useState(false);
  const [likeHovered, setLikeHovered] = useState(false);
  const [whatsappHovered, setWhatsappHovered] = useState(false);
  const { openWhatsApp } = useWhatsApp();

  const animalId = Array.isArray(id) ? id[0] : id;
  const selectedAnimal = animalMocks.find((item) => item.id === animalId) ?? animalMocks[0]!;

  const animal = useMemo(
    () => ({
      ...selectedAnimal,
      species: selectedAnimal.type,
      weight: `${selectedAnimal.weightKg} Kg`,
      status: 'Castrado',
      location: `${selectedAnimal.distanceKm} km de distancia`,
      ownerName: 'Jorge Visconti',
      ownerRole: 'Dueño',
      ownerInitials: 'JV',
      whatsapp: WHATSAPP_PLACEHOLDER,
      imageUrl: selectedAnimal.photoUri,
      description:
        'Es cariñoso, sociable y disfruta estar acompañado. Busca un hogar responsable donde pueda recibir cuidado, paseos y mucho afecto todos los días.',
    }),
    [selectedAnimal],
  );

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
    [animal.name],
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
              <LocationSvg width={22} height={22} color="#4E4A4A" />
              <CustomText variant="p" style={styles.locationText}>
                {animal.location}
              </CustomText>
            </View>

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
                  <WhatsAppSvg width={44} height={44} />
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
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
    paddingBottom: 28,
  },
  hero: {
    width: '100%',
    height: 318,
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
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 31,
  },
  description: {
    marginTop: 4,
    color: theme.colors.black,
    fontFamily: roundedFont,
    fontSize: 19,
    fontWeight: '400',
    lineHeight: 29,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
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
    alignItems: 'center',
    marginTop: 18,
    paddingHorizontal: 16,
  },
  footer: {
    width: '90%',
    maxWidth: 348,
    height: 58,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 18,
    paddingRight: 8,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 3,
    elevation: 4,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFC36B',
  },
  avatarText: {
    color: theme.colors.white,
    fontFamily: roundedSemiBold,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  ownerName: {
    flex: 1,
    marginLeft: 10,
    color: theme.colors.white,
    fontFamily: roundedFont,
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 26,
  },
  ownerRole: {
    marginLeft: 8,
    marginRight: 5,
    color: '#FFE0B0',
    fontFamily: roundedFont,
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 25,
  },
  whatsappButton: {
    width: 48,
    height: 48,
    borderRadius: 25,
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
