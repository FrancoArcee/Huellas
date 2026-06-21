import { StyleSheet, ScrollView } from "react-native";
import { AnimalCard } from "../../../shared/components/ui/AnimalCard";
import { Animal } from "../../../../../Shared/types/animal";

interface ExtendedAnimal extends Animal {
  isFavorite?: boolean;
}

interface AnimalsCarouselProps {
  animals: ExtendedAnimal[];
  onFavoriteToggle?: (id: string) => void;
}

export function AnimalsCarousel({ animals, onFavoriteToggle }: AnimalsCarouselProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {animals.map((animal) => (
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
          isFavorite={animal.isFavorite || false}
          onFavoritePress={() => onFavoriteToggle?.(animal.id)}
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