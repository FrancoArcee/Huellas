import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreen } from '../../src/features/home/screens/HomeScreen';
import { Stack } from 'expo-router';
import { theme } from '../../src/theme';

export default function HomeRoute() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: '',
          title: 'Inicio',
        }}
      />
      <View style={{ flex: 1, paddingTop: insets.top + 20, backgroundColor: theme.colors.background }}>
        <HomeScreen />
      </View>
    </>
  );
}
