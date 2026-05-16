import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../../theme';
import { Button } from '../../../shared/components/ui/Button';
import { CustomText } from '../../../shared/components/ui/CustomText';

export const HomeScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <CustomText variant="h1" style={{ marginBottom: 40 }}>
        Huellas App
      </CustomText>

      <Button
        title="Ir al Login"
        onPress={() => router.push('/(auth)/login')}
        style={styles.navButton}
      />

      <Button
        title="Ir al Registro"
        onPress={() => router.push('/(auth)/register')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: theme.colors.background,
  },
  navButton: {
    marginBottom: 16,
  },
});
