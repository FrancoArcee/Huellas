import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { theme } from '../../../theme';
import { CustomText } from '../../../shared/components/ui/CustomText';
import ChevronBackSvg from '../../../assets/icons/buttons/chevronBack.svg';
import LikeIcon from '../../../assets/icons/like.svg';
import LocationSvg from '../../../assets/icons/location.svg';
import WhatsAppSvg from '../../../assets/icons/socialNetwork/whatsapp.svg';
import TelegramSvg from '../../../assets/icons/socialNetwork/telegram.svg';
import InstagramSvg from '../../../assets/icons/socialNetwork/instagram.svg';
import DiscordSvg from '../../../assets/icons/socialNetwork/discord.svg';
import FacebookSvg from '../../../assets/icons/socialNetwork/facebook.svg';
import MessengerSvg from '../../../assets/icons/socialNetwork/messenger.svg';
import { useAuthStore } from '../../../shared/store/authStore';
import { openContactApp } from '../../../shared/utils/contact-apps';
import { translateCategory, translateGender, translateSize } from '../../../shared/utils/translations';
import { animalService, type AnimalPost } from '../services/animalService';

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

function getOwnerInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const contactIcons = {
  WhatsApp: WhatsAppSvg,
  Telegram: TelegramSvg,
  Instagram: InstagramSvg,
  Discord: DiscordSvg,
  Facebook: FacebookSvg,
  Messenger: MessengerSvg,
};

export const AnimalDetailScreen = ({ topInset = 0 }: Props) => {
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const { user } = useAuthStore();

  const animalId = Array.isArray(id) ? id[0] : id;

  const [post, setPost] = useState<AnimalPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [contacting, setContacting] = useState(false);
  const [backHovered, setBackHovered] = useState(false);
  const [likeHovered, setLikeHovered] = useState(false);
  const [contactHovered, setContactHovered] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [heroWidth, setHeroWidth] = useState(windowWidth);

  const isOwner = user != null && post != null && user.id === post.userId;
  const liked = favoriteId !== null;

  useEffect(() => {
    if (!animalId) return;

    const load = async () => {
      try {
        const [postData, favData] = await Promise.all([
          animalService.getAnimalDetail(animalId),
          user ? animalService.checkFavorite(animalId) : Promise.resolve(null),
        ]);
        setPost(postData);
        setActivePhotoIndex(0);
        setFavoriteId(favData?.id ?? null);
      } catch (err) {
        console.error('Error cargando detalle del animal:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [animalId, user]);

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

  const contactMessage = useMemo(
    () => (post ? `Hola, vi a ${post.name} en Huellas y quisiera consultar por su adopción.` : ''),
    [post],
  );

  const handleToggleFavorite = async () => {
    if (!post || favoriteLoading) return;
    setFavoriteLoading(true);
    try {
      if (liked && favoriteId) {
        await animalService.removeFavorite(favoriteId);
        setFavoriteId(null);
      } else {
        const fav = await animalService.addFavorite(post.id);
        setFavoriteId(fav.id);
      }
    } catch (err) {
      console.error('Error al cambiar favorito:', err);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleContact = async () => {
    if (!post) return;
    try {
      setContacting(true);
      const opened = await openContactApp({
        contact: post.user.contact,
        contactType: post.user.contactType,
        message: contactMessage,
      });

      if (!opened) {
        Alert.alert(
          'Contacto por Discord',
          `El usuario de Discord es ${post.user.contact}. Todavía no podemos abrir directamente este perfil.`,
        );
      }
    } catch (error) {
      console.error(`Error al abrir ${post.user.contactType}:`, error);
      Alert.alert(
        'No se pudo abrir la aplicación',
        `Revisá que ${post.user.contactType} esté disponible en tu dispositivo.`,
      );
    } finally {
      setContacting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.centered}>
        <CustomText variant="p">No se pudo cargar la publicación.</CustomText>
      </View>
    );
  }

  const ownerInitials = getOwnerInitials(post.user.name);
  const photos = post.photosUrl?.length ? post.photosUrl : [''];
  const weightLabel = `${post.weight} Kg`;
  const ageLabel = `${post.age} ${post.age === 1 ? 'año' : 'años'}`;
  const ContactIcon = contactIcons[post.user.contactType];

  return (
    <View style={styles.screen}>
      <View style={styles.contentShell}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={styles.hero}
            onLayout={({ nativeEvent }) => setHeroWidth(nativeEvent.layout.width)}
          >
            <ScrollView
              horizontal
              pagingEnabled
              bounces={false}
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              onScroll={({ nativeEvent }) => {
                if (heroWidth <= 0) return;
                const nextIndex = Math.round(nativeEvent.contentOffset.x / heroWidth);
                const boundedIndex = Math.max(0, Math.min(nextIndex, photos.length - 1));
                setActivePhotoIndex(boundedIndex);
              }}
            >
              {photos.map((photoUrl, index) => (
                <ImageBackground
                  key={`${photoUrl}-${index}`}
                  source={{ uri: photoUrl }}
                  style={[styles.hero, { width: heroWidth }]}
                  imageStyle={styles.heroImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>

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

              {!isOwner && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={liked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  accessibilityState={{ selected: liked, busy: favoriteLoading }}
                  onPress={handleToggleFavorite}
                  disabled={favoriteLoading}
                  onHoverIn={() => setLikeHovered(true)}
                  onHoverOut={() => setLikeHovered(false)}
                  style={({ pressed }) => [
                    styles.iconButton,
                    liked && styles.likeButtonSelected,
                    (pressed || likeHovered) && styles.iconButtonActive,
                    favoriteLoading && styles.iconButtonDisabled,
                  ]}
                >
                  <LikeIcon
                    width={25}
                    height={23}
                    fill={liked ? '#ff6b8a' : 'none'}
                    stroke={liked ? '#ff6b8a' : theme.colors.white}
                  />
                </Pressable>
              )}
            </View>

            {photos.length > 1 ? (
              <View style={styles.pagination} pointerEvents="none">
                {photos.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      index === activePhotoIndex && styles.paginationDotActive,
                    ]}
                  />
                ))}
              </View>
            ) : null}
          </View>

          <View style={styles.body}>
            <View style={styles.titleCard}>
              <CustomText variant="h1" style={styles.title}>
                {post.name}
              </CustomText>
              <CustomText variant="p" style={styles.subtitle}>
                {translateCategory(post.category)} · {ageLabel}
              </CustomText>
            </View>

            <View style={styles.tagsRow}>
              <View style={styles.tag}>
                <CustomText style={styles.tagText}>{translateGender(post.gender)}</CustomText>
              </View>
              <View style={styles.tag}>
                <CustomText style={styles.tagText}>{weightLabel}</CustomText>
              </View>
              <View style={styles.tag}>
                <CustomText style={styles.tagText}>{translateSize(post.size)}</CustomText>
              </View>
            </View>

            <View style={styles.about}>
              <CustomText variant="h4" style={styles.sectionTitle}>
                Sobre {post.name}
              </CustomText>
              <CustomText variant="p" style={styles.description}>
                {post.description}
              </CustomText>
            </View>

            {post.location ? (
              <View style={styles.locationRow}>
                <LocationSvg width={22} height={22} color="#4E4A4A" />
                <CustomText variant="p" style={styles.locationText}>
                  {post.location}
                </CustomText>
              </View>
            ) : null}

            <View style={styles.footerWrap}>
              <View style={styles.footer}>
                <View style={styles.avatar}>
                  <CustomText style={styles.avatarText}>{ownerInitials}</CustomText>
                </View>
                <CustomText variant="p" style={styles.ownerName} numberOfLines={1}>
                  {post.user.name}
                </CustomText>
                <CustomText variant="p" style={styles.ownerRole}>
                  Dueño
                </CustomText>
                {!isOwner && (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Contactar por ${post.user.contactType} a ${post.user.name}`}
                    accessibilityState={{ disabled: contacting }}
                    disabled={contacting}
                    onPress={handleContact}
                    onHoverIn={() => setContactHovered(true)}
                    onHoverOut={() => setContactHovered(false)}
                    style={({ pressed }) => [
                      styles.contactButton,
                      (pressed || contactHovered) && !contacting && styles.contactButtonActive,
                      contacting && styles.contactButtonDisabled,
                    ]}
                  >
                    <ContactIcon width={44} height={44} />
                  </Pressable>
                )}
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 27,
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
  },
  paginationDotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.white,
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
  iconButtonDisabled: {
    opacity: 0.5,
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
  contactButton: {
    width: 48,
    height: 48,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactButtonActive: {
    transform: [{ scale: 0.94 }],
    opacity: 0.88,
  },
  contactButtonDisabled: {
    opacity: 0.45,
  },
});
