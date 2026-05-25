import { View, StyleSheet } from 'react-native';
import { theme } from '../../src/theme';
import { Stack } from 'expo-router';
import { MisPublicacionesScreen } from '../../src/features/admin/screens/MisPublicacionesScreen';

export default function ExploreRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          title: 'Mascotas',
        }}
      />
      <View style={styles.container}>
        <MisPublicacionesScreen />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
