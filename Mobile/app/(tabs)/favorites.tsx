import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomText } from '../../src/shared/components/ui/CustomText';
import { theme } from '../../src/theme';
import { Stack } from 'expo-router';
import BackIcon from '../../src/assets/icons/buttons/chevronBack.svg';

export default function FavoritesRoute() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: '',
          title: 'Favoritos',
          headerLeft: () => (
            <View style={{ marginLeft: 16 }}>
              <BackIcon
                width={26}
                height={26}
              />
            </View>
          ),
        }}
      />
      <View style={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom }]}>
        <CustomText variant="h2">Favoritos</CustomText>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});
