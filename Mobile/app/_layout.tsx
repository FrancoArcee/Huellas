import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

import { theme } from "../src/theme";
import { useAuthStore } from '../src/shared/store/authStore';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, isLoading, initialize } = useAuthStore();

  // Inicializar sesión al cargar la app
  useEffect(() => {
    initialize();
  }, []);

  // Guard de navegación
  useEffect(() => {
    if (isLoading || !fontsLoaded) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';
    const onWelcome = (segments.length as number) === 0 || ((segments.length as number) === 1 && segments[0] === 'index');

    if (!isAuthenticated && (inTabsGroup || segments[0] === '(admin)' || segments[0] === 'edit-profile')) {
      // Si no está autenticado e intenta entrar a pantallas privadas, redirigir a login
      router.replace('/(auth)/login');
    } else if (isAuthenticated && (inAuthGroup || onWelcome)) {
      // Si está autenticado e intenta entrar a login/registro o bienvenida, redirigir a principal
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, fontsLoaded, segments]);

  // Mostrar indicador de carga mientras inicializa o carga fuentes
  if (!fontsLoaded || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(admin)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="edit-profile" />
      </Stack>
    </GestureHandlerRootView>
  );
}