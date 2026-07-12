import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Location from '../../../assets/icons/location.svg';
import LikeIcon from '../../../assets/icons/like.svg';

interface PetHorizontalCardProps {
  name: string;
  details: string;
  location: string;
  image: ImageSourcePropType | string;
  tags?: string[];
  buttonText?: string;
  isLiked?: boolean;
  onPress?: () => void;
  onButtonPress?: () => void;
  onLikePress?: () => void;
  style?: ViewStyle;
}

export function PetHorizontalCard({
  name,
  details,
  location,
  image,
  tags = [],
  buttonText = 'Ver detalles',
  isLiked = false,
  onPress,
  onButtonPress,
  onLikePress,
  style,
}: PetHorizontalCardProps) {
  const imageSource = typeof image === 'string' ? { uri: image } : image;

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && onPress ? styles.cardPressed : null,
        style,
      ]}
    >
      {onLikePress && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isLiked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          accessibilityState={{ selected: isLiked }}
          style={styles.likeButton}
          onPress={(event) => {
            event?.stopPropagation?.();
            onLikePress();
          }}
        >
          <LikeIcon
            width={22}
            height={21}
            fill={isLiked ? '#FFB0B0' : 'none'}
            stroke={isLiked ? '#FFB0B0' : '#FFB0B0'}
          />
        </Pressable>
      )}

      <View style={styles.cardInfo}>
        <View>
          <Text style={styles.petName}>{name}</Text>
          <Text style={styles.petDetails}>{details}</Text>

          <View style={styles.locationContainer}>
            <Location width={13} height={13} color="#666666" style={styles.locationIcon} />
            <Text style={styles.locationText}>{location}</Text>
          </View>
        </View>

        {tags.length > 0 && (
          <View style={styles.tagContainer}>
            {tags.map((tag) => (
              <View style={styles.tag} key={tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {onButtonPress && (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.button}
              onPress={(event) => {
                event.stopPropagation();
                onButtonPress();
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.petImage} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
    height: 175,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 4,
  },
  cardPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.94,
  },
  cardInfo: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 12,
    paddingVertical: 18,
    justifyContent: 'space-between',
  },
  petName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  petDetails: {
    fontSize: 14,
    color: '#000000',
    marginTop: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  locationIcon: {
    marginRight: 6,
  },
  locationText: {
    fontSize: 13,
    color: '#666666',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 7,
  },
  tag: {
    backgroundColor: '#e3d7ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#8e44ad',
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 9,
  },
  button: {
    backgroundColor: '#f39c12',
    minHeight: 34,
    borderRadius: 17,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  likeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
    zIndex: 10,
    elevation: 5,
  },
  imageContainer: {
    width: '40%',
    alignSelf: 'stretch',
  },
  petImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
