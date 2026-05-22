import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View, StyleSheet } from 'react-native';
import { theme } from '../../../theme';
import { CustomText } from '../../../shared/components/ui/CustomText';
import DogIcon     from '../../../assets/icons/categories/dog.svg';
import CatIcon     from '../../../assets/icons/categories/cat.svg';
import BirdIcon    from '../../../assets/icons/categories/bird.svg';
import RabbitIcon  from '../../../assets/icons/categories/rabbit.svg';
import TurtleIcon  from '../../../assets/icons/categories/turtle.svg';
import HamsterIcon from '../../../assets/icons/categories/hamster.svg';
import FishIcon    from '../../../assets/icons/categories/fish.svg';

type CategoryId = 'dog' | 'cat' | 'bird' | 'rabbit' | 'turtle' | 'hamster' | 'fish';

const CATEGORIES: { id: CategoryId; label: string; Icon: React.FC<any> }[] = [
  { id: 'dog',     label: 'Perros',   Icon: DogIcon },
  { id: 'cat',     label: 'Gatos',    Icon: CatIcon },
  { id: 'bird',    label: 'Aves',     Icon: BirdIcon },
  { id: 'rabbit',  label: 'Conejos',  Icon: RabbitIcon },
  { id: 'turtle',  label: 'Tortugas', Icon: TurtleIcon },
  { id: 'hamster', label: 'Hamsters', Icon: HamsterIcon },
  { id: 'fish',    label: 'Peces',    Icon: FishIcon },
];

export const CategoryCarousel = () => {
  const [selected, setSelected] = useState<CategoryId | null>(null);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {CATEGORIES.map(({ id, label, Icon }) => {
        const isSelected = selected === id;
        return (
          <TouchableOpacity
            key={id}
            style={styles.item}
            onPress={() => setSelected(isSelected ? null : id)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconContainer,
                isSelected && styles.iconContainerSelected,
              ]}
            >
              <Icon width={32} height={32} />
            </View>
            <CustomText
              variant="caption"
              style={[
                styles.label,
                isSelected && styles.labelSelected,
              ]}
            >
              {label}
            </CustomText>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: theme.spacing['2xl'],
    gap: theme.spacing.lg,
  },
  item: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: theme.colors.gray200,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: '#FFF5E6', // tono cálido suave derivado del primary
  },
  label: {
    color: theme.colors.textSecondary,
  },
  labelSelected: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.medium,
  },
});
