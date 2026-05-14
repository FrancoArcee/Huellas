import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../../theme';
import { CustomText } from '../ui/CustomText';
import HomeIcon from '../../../assets/icons/screens/home.svg';
import SearchIcon from '../../../assets/icons/screens/search.svg';
import ExploreIcon from '../../../assets/icons/screens/explore.svg';
import LikeIcon from '../../../assets/icons/screens/like.svg';

export type TabName = 'home' | 'search' | 'explore' | 'favorites';

interface NavbarProps {
  activeTab: TabName;
  onTabPress?: (tab: TabName) => void;
}

const TABS: { name: TabName; label: string; Icon: React.FC<any> }[] = [
  { name: 'home', label: 'Inicio', Icon: HomeIcon },
  { name: 'search', label: 'Búsqueda', Icon: SearchIcon },
  { name: 'explore', label: 'Explorar', Icon: ExploreIcon },
  { name: 'favorites', label: 'Favoritos', Icon: LikeIcon },
];

export const Navbar = ({ activeTab, onTabPress }: NavbarProps) => {
  const insets = useSafeAreaInsets();

  // Si el dispositivo tiene botones de navegación (insets.bottom > 0), los respetamos.
  // Si los botones "desaparecen" (insets.bottom = 0), usamos el padding estándar.
  const bottomPadding = Math.max(insets.bottom, theme.spacing.lg);

  return (
    <View style={[styles.container, { paddingBottom: bottomPadding }]}>
      {TABS.map(({ name, label, Icon }) => {
        const isActive = activeTab === name;

        return (
          <TouchableOpacity
            key={name}
            style={styles.tab}
            onPress={() => onTabPress?.(name)}
            activeOpacity={0.7}
          >
            {/* Ícono: solo el activo recibe color naranja; los demás usan sus colores de fábrica */}
            {isActive
              ? <Icon width={24} height={24} fill={theme.colors.primary} stroke={theme.colors.primary} />
              : <Icon width={24} height={24} />
            }

            <CustomText
              variant="caption"
              style={[styles.label, isActive && styles.labelActive]}
            >
              {label}
            </CustomText>

            {/* Barra naranja en la parte superior del tab activo */}
            {isActive && <View style={styles.activeBar} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    paddingTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xs,
    gap: 2,
  },
  label: {
    marginTop: 2,
    color: theme.colors.gray400,
  },
  labelActive: {
    color: theme.colors.primary,
  },
  activeBar: {
    position: 'absolute',
    top: -theme.spacing.sm, // compensa el paddingTop del container (8px) para tocar el techo
    width: 40,
    height: 5,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: theme.colors.primary,
  },
});
