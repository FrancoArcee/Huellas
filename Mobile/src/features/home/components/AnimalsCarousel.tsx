import { StyleSheet, ScrollView } from "react-native";
import { useState } from "react";
import { AnimalCard } from "../../../shared/components/ui/AnimalCard";
import { animalMocks } from "../../../mocks/animalsMocks";

export function AnimalsCarousel({ }) {
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {animalMocks.map((animal) => (
        <AnimalCard
          key={animal.id}
          id={animal.id}
          name={animal.name}
          photoUri={animal.photoUri}
          distanceKm={animal.distanceKm}
          type={animal.type}
          gender={animal.gender}
          age={animal.age}
          weightKg={animal.weightKg}
          isFavorite={favorites[animal.id] || false}
          onFavoritePress={() => setFavorites(prev => ({
            ...prev,
            [animal.id]: !prev[animal.id]
          }))}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    gap: 15,
    paddingHorizontal: 20,
  },
});