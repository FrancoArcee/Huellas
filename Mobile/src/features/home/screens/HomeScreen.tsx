import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Dimensions,
  FlatList,
  ImageBackground,
} from 'react-native';
import { useState, useMemo, useRef } from 'react';
import { useRouter } from 'expo-router';
import { theme } from '../../../theme';
import { CustomText } from '../../../shared/components/ui/CustomText';
import {
  SearchIcon,
  FilterIcon,
  HeartIcon,
  LocationIcon,
} from '../../../shared/components/ui/Icons';

import DogSvg from '../../../assets/icons/categories/dog.svg';
import CatSvg from '../../../assets/icons/categories/cat.svg';
import BirdSvg from '../../../assets/icons/categories/bird.svg';
import RabbitSvg from '../../../assets/icons/categories/rabbit.svg';
import TurtleSvg from '../../../assets/icons/categories/turtle.svg';
import HamsterSvg from '../../../assets/icons/categories/hamster.svg';
import FishSvg from '../../../assets/icons/categories/fish.svg';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 80;

const CATEGORIES = [
  { id: 'perros', label: 'Perros' },
  { id: 'gatos', label: 'Gatos' },
  { id: 'aves', label: 'Aves' },
  { id: 'conejos', label: 'Conejos' },
  { id: 'tortugas', label: 'Tortugas' },
  { id: 'hamsters', label: 'Hamsters' },
  { id: 'peces', label: 'Peces' },
];

const CATEGORY_ICONS: Record<string, any> = {
  perros: DogSvg,
  gatos: CatSvg,
  aves: BirdSvg,
  conejos: RabbitSvg,
  tortugas: TurtleSvg,
  hamsters: HamsterSvg,
  peces: FishSvg,
};

const MOCK_CARDS = [
  {
    id: '1',
    name: 'Luna',
    meta: 'Beagle · Hembra · 2 años',
    weight: '12 KG',
    distance: '0.6 km',
    image: require('../../../assets/images/Perro1.png') as any,
  },
  {
    id: '2',
    name: 'Max',
    meta: 'Labrador · Macho · 3 años',
    weight: '28 KG',
    distance: '1.2 km',
    image: require('../../../assets/images/Perro2.png') as any,
  },
  {
    id: '3',
    name: 'Milo',
    meta: 'Macho · 6 años',
    weight: '1,2 KG',
    distance: '1.8 km',
    image: require('../../../assets/images/Tortuga.png') as any,
  },
  {
    id: '4',
    name: 'Nala',
    meta: 'Hembra · 4 años',
    weight: '14 KG',
    distance: '2.4 km',
    image: require('../../../assets/images/Gato1.png') as any,
  },
  {
    id: '5',
    name: 'Oso',
    meta: 'Macho · 5 años',
    weight: '8 KG',
    distance: '3.0 km',
    image: require('../../../assets/images/Gato2.png') as any,
  },
];

export const HomeScreen = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('perros');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null as any);

  const toggleFav = (id: string) =>
    setFavorites((s) => ({ ...s, [id]: !s[id] }));

  const filteredCards = useMemo(() => {
    if (!query) return MOCK_CARDS;
    return MOCK_CARDS.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const goToSearch = () => {
    try {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    } catch (e) {}
    inputRef.current?.focus?.();
  };

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.screen}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      {/* HEADER */}
      <View style={styles.header}>
        <CustomText variant="h3" style={styles.subtitle}>
          Adopta
        </CustomText>

        <CustomText variant="h1" style={styles.title}>
          tu próximo compañero
        </CustomText>
      </View>

      {/* SEARCH ROW */}
      <View style={styles.searchRow}>
        <Pressable style={styles.searchBox} onPress={goToSearch}>
          <SearchIcon width={20} height={20} color={theme.colors.textSecondary} />
          <TextInput
            ref={inputRef}
            placeholder="Buscá por raza, edad, ubicación..."
            placeholderTextColor={theme.colors.textSecondary}
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
          />
        </Pressable>
        <Pressable
          style={styles.filterButton}
          onPress={() => goToSearch()}
        >
          <FilterIcon width={20} height={20} color={theme.colors.white} />
        </Pressable>
      </View>

      {/* CATEGORÍAS */}
      <CustomText variant="h4" style={styles.sectionTitle}>
        Categorias
      </CustomText>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categories}
      >
        {CATEGORIES.map((cat) => {
          const active = cat.id === activeCategory;
          return (
            <Pressable
              key={cat.id}
              style={styles.categoryWrap}
              onPress={() => setActiveCategory(cat.id)}
            >
              <View
                style={[
                  styles.categoryItem,
                  active && styles.categoryItemActive,
                ]}
              >
                {(() => {
                  const Icon = CATEGORY_ICONS[cat.id];
                  if (!Icon) return null;
                  return <Icon width={34} height={34} />;
                })()}
              </View>
              <CustomText
                variant="caption"
                style={[styles.catLabel, active && styles.catLabelActive]}
              >
                {cat.label}
              </CustomText>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* CERCA TUYO */}
      <CustomText variant="h4" style={styles.sectionTitle}>
        Cerca tuyo
      </CustomText>

      <FlatList
        ref={flatListRef}
        data={filteredCards}
        keyExtractor={(i) => i.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 16}
        decelerationRate="fast"
        contentContainerStyle={styles.carouselContent}
        onScroll={(e) => {
          const idx = Math.round(
            e.nativeEvent.contentOffset.x / (CARD_WIDTH + 16)
          );
          setActiveIndex(idx);
        }}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => router.push('/animal/' + item.id)}
          >
            {/* Imagen de fondo — reemplazá null por require('../assets/...') */}
            <ImageBackground
              source={item.image}
              style={styles.cardImage}
              imageStyle={{ borderRadius: 20 }}
            >
              {/* Overlay degradado para legibilidad del texto */}
              <View style={styles.cardOverlay} />

              {/* Badge distancia */}
              <View style={styles.distanceBadge}>
                <LocationIcon width={14} height={14} color="#fff" />
                <CustomText variant="caption" style={styles.distanceText}>
                  {item.distance}
                </CustomText>
              </View>

              {/* Corazón */}
              <Pressable
                onPress={() => toggleFav(item.id)}
                style={[
                  styles.heartBtn,
                  favorites[item.id] && styles.heartBtnActive,
                ]}
              >
                <HeartIcon
                  width={20}
                  height={20}
                  color={favorites[item.id] ? theme.colors.primary : theme.colors.gray400}
                />
              </Pressable>

              {/* Info del animal en la parte inferior */}
              <View style={styles.cardInfo}>
                <CustomText style={styles.cardName}>{item.name}</CustomText>
                <CustomText style={styles.cardMeta}>{item.meta}</CustomText>
                <CustomText style={styles.cardWeight}>{item.weight}</CustomText>
              </View>
            </ImageBackground>
          </Pressable>
        )}
      />

      {/* DOTS */}
      <View style={styles.dotsRow}>
        {filteredCards.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === activeIndex && styles.dotActive]}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.background,
  },

  contentContainer: {
    paddingBottom: 40,
  },

  /* Header */
  header: {
    marginTop: 8,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 18,
    fontWeight: '400',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    lineHeight: 34,
  },

  /* Search */
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
    fontSize: 18,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    elevation: 3,
  },

  /* Sección títulos */
  sectionTitle: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },

  /* Categorías */
  categories: {
    paddingBottom: 4,
    alignItems: 'flex-start',
  },
  categoryWrap: {
    marginRight: 14,
    alignItems: 'center',
    width: 64,
  },
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryItemActive: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
    backgroundColor: '#FFF5EC',
  },
  catIcon: {
    fontSize: 26,
  },
  catLabel: {
    marginTop: 6,
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  catLabelActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },

  /* Carrusel */
  carouselContent: {
    paddingRight: 20,
  },
  card: {
    width: CARD_WIDTH,
    height: 320,
    marginRight: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  cardImage: {
    flex: 1,
    backgroundColor: theme.colors.gray100, // fallback si no hay imagen
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 24,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    // Degradado simulado: transparente arriba, oscuro abajo
    backgroundColor: 'transparent',
    // React Native no soporta LinearGradient nativo,
    // instalá expo-linear-gradient y reemplazá este View por <LinearGradient>
    // colors={['transparent', 'rgba(0,0,0,0.65)']} start={{x:0,y:0}} end={{x:0,y:1}}
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  distanceIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  distanceText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  heartBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  heartBtnActive: {
    backgroundColor: '#FFF0EB',
  },
  cardInfo: {
    // Texto sobre la imagen, parte inferior
  },
  cardName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  cardMeta: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    marginTop: 4,
  },
  cardWeight: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    marginTop: 4,
  },

  /* Dots */
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.gray200 ?? '#E0E0E0',
    marginHorizontal: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: theme.colors.primary,
  },
});