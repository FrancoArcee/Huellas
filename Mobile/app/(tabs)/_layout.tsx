import { Tabs } from 'expo-router';
import { theme } from '../../src/theme';
import HomeSvg from '../../src/assets/icons/screens/home.svg';
import SearchSvg from '../../src/assets/icons/screens/search.svg';
import ExploreSvg from '../../src/assets/icons/screens/explore.svg';
import LikeSvg from '../../src/assets/icons/screens/like.svg';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.gray700,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.gray100,
        },
        tabBarLabelStyle: {
          fontFamily: theme.typography.fontFamily.medium,
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <HomeSvg width={size} height={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Buscar',
          tabBarIcon: ({ color, size }) => (
            <SearchSvg width={size} height={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color, size }) => (
            <ExploreSvg width={size} height={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color, size }) => (
            <LikeSvg width={size} height={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
