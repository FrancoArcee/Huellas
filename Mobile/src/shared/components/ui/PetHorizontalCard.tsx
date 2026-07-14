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
import { translateStatus, getStatusColors } from '../../utils/translations';

interface PetHorizontalCardProps {
  name: string;
  details: string;
  location: string;
  image: ImageSourcePropType | string;
  tags?: (string | { text: string; bg?: string; color?: string })[];
  buttonText?: string;
  isLiked?: boolean;
  onPress?: () => void;
  onButtonPress?: () => void;
  onLikePress?: () => void;
  style?: ViewStyle;
  status?: string;
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
  status,
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


      <View style={styles.cardInfo}>
        <View>
          <View style={styles.nameRow}>
            <Text style={styles.petName} numberOfLines={1}>{name}</Text>
            {status ? (
              <View style={[styles.statusBadge, { backgroundColor: getStatusColors(status).bg }]}>
                <Text style={[styles.statusBadgeText, { color: getStatusColors(status).color }]}>
                  {translateStatus(status)}
                </Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.petDetails} numberOfLines={1}>{details}</Text>

          <View style={styles.locationContainer}>
            <Location width={13} height={13} color="#666666" style={styles.locationIcon} />
            <Text style={styles.locationText}>{location}</Text>
          </View>
        </View>

        {tags.length > 0 && (
          <View style={styles.tagContainer}>
            {tags.map((tag, idx) => {
              const isObject = typeof tag === 'object' && tag !== null;
              const text = isObject ? tag.text : tag;
              const customBg = isObject && tag.bg ? tag.bg : '#e3d7ff';
              const customColor = isObject && tag.color ? tag.color : '#8e44ad';
              return (
                <View style={[styles.tag, { backgroundColor: customBg }]} key={idx}>
                  <Text style={[styles.tagText, { color: customColor }]}>{text}</Text>
                </View>
              );
            })}
          </View>
        )}

        {(onButtonPress || onLikePress) && (
          <View style={styles.actionsRow}>
            {onButtonPress && (
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
            )}

            {onLikePress && (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={isLiked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                accessibilityState={{ selected: isLiked }}
                style={styles.actionsLikeButton}
                onPress={(event) => {
                  event.stopPropagation();
                  onLikePress();
                }}
                activeOpacity={0.8}
              >
                <LikeIcon
                  width={20}
                  height={19}
                  fill={isLiked ? '#FFB0B0' : 'none'}
                  stroke={isLiked ? '#FFB0B0' : '#FFFFFF'}
                  strokeWidth={2.2}
                />
              </TouchableOpacity>
            )}
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
    gap: 8,
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
  actionsLikeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#737272',
    justifyContent: 'center',
    alignItems: 'center',
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
