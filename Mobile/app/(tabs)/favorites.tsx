import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PetHorizontalCard } from '../../src/shared/components/ui/PetHorizontalCard';
import { animalService } from '../../src/features/animals/services/animalService';
import { useAuthStore } from '../../src/shared/store/authStore';
import { storage } from '../../src/shared/services/storage';
import { getDistanceKm } from '../../src/shared/utils/distance';
import { theme } from '../../src/theme';

export default function FavoritesRoute() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuthStore();
  const userId = user?.id;

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  const fetchFavorites = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const coords = await storage.getLocationCoords();
      if (coords) {
        setUserCoords(coords);
      }

      const data = await animalService.getUserFavorites(userId);
      const formattedPosts = (data || []).map((item: any) => {

        if (item.post) {
          return {
            ...item.post,
            favoriteId: item.id,
          };
        }
        return {
          ...item,
          favoriteId: item.favoriteId || item.id,
        };
      });

      setPosts(formattedPosts);
    } catch (error) {
      console.warn('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchFavorites();
    }, [fetchFavorites])
  );

  const openDetail = (id: string) => {
    router.push({
      pathname: '/animals/[id]',
      params: { id },
    });
  };

  const handleUnlike = async (favoriteId: string, postId: string) => {
    setPosts((current) => current.filter((post) => post.id !== postId));

    try {
      await animalService.removeFavorite(favoriteId);
    } catch (error) {
      console.warn('Error removing favorite:', error);
      fetchFavorites();
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.screen}>
        <View style={[styles.contentShell, { paddingTop: insets.top }]}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Mis favoritos</Text>
          </View>

          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : posts.length === 0 ? (
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>Aún no likeaste ninguna publicación</Text>
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.listContent,
                { paddingBottom: insets.bottom + 98 },
              ]}
            >
              {posts.map((pet) => {
                let distanceText = 'N/A';
                if (userCoords && pet.latitude !== undefined && pet.longitude !== undefined) {
                  const dist = getDistanceKm(
                    userCoords.latitude,
                    userCoords.longitude,
                    pet.latitude,
                    pet.longitude
                  );
                  distanceText = dist < 1
                    ? `${Math.round(dist * 1000)} m`
                    : `${dist.toFixed(1)} km`;
                }

                const petType = pet.category === 'dog' ? 'Perro' : pet.category === 'cat' ? 'Gato' : 'Otro';
                const petGender = pet.gender || 'Macho';
                const petAge = pet.age ? `${pet.age} ${pet.age === 1 ? 'año' : 'años'}` : '';
                const details = `${petType} · ${petGender} · ${petAge}`;

                const imageSource = pet.photosUrl?.[0] || '';

                const tags = [petGender];
                if (pet.weight !== undefined) {
                  tags.push(`${pet.weight} KG`);
                }

                return (
                  <PetHorizontalCard
                    key={pet.id}
                    name={pet.name}
                    details={details}
                    location={distanceText}
                    image={imageSource}
                    tags={tags}
                    isLiked={true}
                    onButtonPress={() => openDetail(pet.id)}
                    onLikePress={() => handleUnlike(pet.favoriteId, pet.id)}
                    style={styles.petCard}
                  />
                );
              })}
            </ScrollView>
          )}
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 42,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
  },
  listContent: {
    paddingTop: 12,
  },
  petCard: {
    width: '92%',
    maxWidth: 360,
    height: 210,
    alignSelf: 'center',
    marginBottom: 34,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily.medium,
    textAlign: 'center',
  },
});
