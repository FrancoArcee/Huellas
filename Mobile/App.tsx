import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importa tus componentes y el theme
import { theme } from './src/theme';
import { Button } from './src/shared/components/ui/Button';
import { CustomText } from './src/shared/components/ui/CustomText';
import { LogInScreen } from './src/features/auth/screens/LogInScreen';
import { RegisterScreen } from './src/features/auth/screens/RegisterScreen';

// Definición de las rutas para TypeScript
export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Pantalla temporal para navegar a tus nuevas screens
const HomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.homeContainer}>
      <CustomText variant="h1" style={{ marginBottom: 40 }}>
        Huellas App
      </CustomText>
      
      <Button 
        title="Ir al Login" 
        onPress={() => navigation.navigate('Login')} 
        style={styles.navButton}
      />
      
      <Button 
        title="Ir al Registro" 
        onPress={() => navigation.navigate('Register')} 
      />
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerShown: false, // Ocultamos el header para usar el diseño de tus capturas
          contentStyle: { backgroundColor: theme.colors.background }
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LogInScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: theme.colors.background,
  },
  navButton: {
    marginBottom: 16,
  }
});