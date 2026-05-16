import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ImageSourcePropType } from "react-native";
import LocationIcon from "../../../assets/icons/location.svg";
import LikeIcon from "../../../assets/icons/like.svg";
import { Animal } from "../../../../../Shared/types/animal";

interface AnimalCardProps extends Animal {
  isFavorite?: boolean;
  onFavoritePress?: () => void;
}

export function AnimalCard({
  name,
  photoUri,
  distanceKm,
  type,
  gender,
  age,
  weightKg,
  isFavorite = false,
  onFavoritePress,
}: AnimalCardProps) {
  const imageSource =
    typeof photoUri === "string" ? { uri: photoUri } : photoUri;

  return (
    <View style={styles.card}>
      <ImageBackground
        source={imageSource}
        style={styles.image}
        imageStyle={styles.imageStyle}
        resizeMode="cover"
      >
        {/* Top row: distance badge + favorite button */}
        <View style={styles.topRow}>
          <View style={styles.distanceBadge}>
            <LocationIcon width={16} height={20} />
            <Text style={styles.distanceText}>{distanceKm} km</Text>
          </View>

          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={onFavoritePress}
            activeOpacity={0.8}
          >
            <LikeIcon
              width={22}
              height={20}
              fill={isFavorite ? "#ff6b8a" : "none"}
              stroke={isFavorite ? "#ff6b8a" : "#000000"}
            />
          </TouchableOpacity>
        </View>

        {/* Gradient overlay + info at bottom */}
        <View style={styles.gradient}>
          <Text style={styles.animalName}>{name}</Text>
          <Text style={styles.animalDetails}>
            {type} · {gender} · {age}
          </Text>
          <Text style={styles.animalWeight}>{weightKg} KG</Text>
        </View>
      </ImageBackground>
    </View>
  );
}


const styles = StyleSheet.create({
  card: {
    width: 280,
    height: 320,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  image: {
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
  },
  imageStyle: {
    borderRadius: 24,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  distanceBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 30, 30, 0.72)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  distanceText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(32, 31, 31, 0.64)",
    justifyContent: "center",
    alignItems: "center",
  },
  gradient: {
    paddingHorizontal: 16,
    paddingBottom: 18,
    paddingTop: 60,
    backgroundColor: "rgba(0,0,0,0.01)",
  },
  animalName: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: 0.3,
    textShadowColor: "rgba(1, 1, 1, 0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    marginBottom: 2,
  },
  animalDetails: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 14,
    fontWeight: "500",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    marginBottom: 2,
  },
  animalWeight: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 14,
    fontWeight: "500",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});