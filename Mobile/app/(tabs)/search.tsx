import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import BackIcon from '../../src/assets/icons/buttons/chevronBack.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CustomText } from '../../src/shared/components/ui/CustomText';
import { theme } from '../../src/theme';

export default function SearchRoute() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: '',
          title: 'Buscar',
          headerLeft: () => (
            <View style={{ marginLeft: 16 }}>
              <BackIcon
                width={32}
                height={32}
              />
            </View>
          ),
        }}
      />

      <View style={[styles.container, { paddingTop: insets.top }]}>
        <CustomText variant="h2">Buscar</CustomText>
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