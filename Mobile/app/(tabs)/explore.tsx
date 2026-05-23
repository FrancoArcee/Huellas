import { Pressable, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomText } from '../../src/shared/components/ui/CustomText';
import { theme } from '../../src/theme';
import { Stack, useRouter } from 'expo-router';
import BackIcon from '../../src/assets/icons/buttons/chevronBack.svg';

export default function ExploreRoute() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

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
        <CustomText variant="h2">Explorar</CustomText>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Crear publicacion"
          onPress={() => router.push('/create-post')}
          style={({ pressed }) => [
            styles.createButton,
            pressed && styles.createButtonPressed,
          ]}
        >
          <View style={styles.plusIcon}>
            <View style={styles.plusHorizontal} />
            <View style={styles.plusVertical} />
          </View>
        </Pressable>
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
  createButton: {
    position: 'absolute',
    right: 16,
    bottom: 20,
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FA9D24',
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 7,
    elevation: 7,
    zIndex: 30,
  },
  createButtonPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.96 }],
  },
  plusIcon: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusHorizontal: {
    position: 'absolute',
    width: 28,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.white,
  },
  plusVertical: {
    position: 'absolute',
    width: 4,
    height: 28,
    borderRadius: 2,
    backgroundColor: theme.colors.white,
  },
});
