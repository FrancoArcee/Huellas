import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomText } from '../../src/shared/components/ui/CustomText';
import { PetHorizontalCard } from '../../src/shared/components/ui/PetHorizontalCard';
import { animalMocks } from '../../src/mocks/animalsMocks';
import { theme } from '../../src/theme';
import BackIcon from '../../src/assets/icons/buttons/chevronBack.svg';

const favoritePets = animalMocks.map((animal) => ({
  id: animal.id,
  name: animal.name,
  details: `${animal.type} · ${animal.gender} · ${animal.age}`,
  location: `${animal.distanceKm} km`,
  image: animal.photoUri,
  tags: [animal.gender, `${animal.weightKg} KG`],
}));

export default function FavoritesRoute() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const initialLikes = useMemo(
    () => Object.fromEntries(favoritePets.map((pet) => [pet.id, true])),
    [],
  );
  const [likedPets, setLikedPets] = useState<Record<string, boolean>>(initialLikes);

  const openDetail = (id: string) => {
    router.push({
      pathname: '/animals/[id]',
      params: { id },
    });
  };

  const toggleLike = (id: string) => {
    setLikedPets((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.screen}>
        <View style={[styles.contentShell, { paddingTop: insets.top + 36 }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <BackIcon width={23} height={23} />
          </Pressable>

          <CustomText variant="h3" style={styles.title}>
            Mis Favoritos
          </CustomText>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: insets.bottom + 98 },
            ]}
          >
            {favoritePets.map((pet) => (
              <PetHorizontalCard
                key={pet.id}
                name={pet.name}
                details={pet.details}
                location={pet.location}
                image={pet.image}
                tags={pet.tags}
                isLiked={!!likedPets[pet.id]}
                onButtonPress={() => openDetail(pet.id)}
                onLikePress={() => toggleLike(pet.id)}
                style={styles.petCard}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  contentShell: {
    flex: 1,
    width: '100%',
    maxWidth: 390,
    backgroundColor: theme.colors.background,
  },
  backButton: {
    marginLeft: 27,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#767676',
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.88,
  },
  title: {
    marginLeft: 27,
    marginTop: 35,
    color: theme.colors.black,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 22,
    lineHeight: 29,
  },
  listContent: {
    paddingTop: 27,
  },
  petCard: {
    width: '92%',
    maxWidth: 360,
    height: 210,
    alignSelf: 'center',
    marginBottom: 34,
  },
});
