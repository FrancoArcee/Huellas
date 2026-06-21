import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const storage = {
  /**
   * Guarda el token de sesión.
   */
  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },

  /**
   * Obtiene el token de sesión guardado.
   */
  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(TOKEN_KEY);
  },

  /**
   * Elimina el token de sesión.
   */
  async removeToken(): Promise<void> {
    await AsyncStorage.removeItem(TOKEN_KEY);
  },

  /**
   * Guarda los datos del usuario.
   */
  async setUser(user: any): Promise<void> {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  /**
   * Obtiene los datos del usuario guardados.
   */
  async getUser(): Promise<any | null> {
    const userStr = await AsyncStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  /**
   * Elimina los datos del usuario.
   */
  async removeUser(): Promise<void> {
    await AsyncStorage.removeItem(USER_KEY);
  },

  /**
   * Limpia toda la sesión.
   */
  async clear(): Promise<void> {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  },

  /**
   * Guarda la ubicación del usuario.
   */
  async setLocation(latitude: number, longitude: number): Promise<void> {
    await AsyncStorage.setItem('user_latitude', String(latitude));
    await AsyncStorage.setItem('user_longitude', String(longitude));
  },

  /**
   * Obtiene la ubicación del usuario guardada.
   */
  async getLocationCoords(): Promise<{ latitude: number; longitude: number } | null> {
    const lat = await AsyncStorage.getItem('user_latitude');
    const lng = await AsyncStorage.getItem('user_longitude');
    if (lat && lng) {
      return { latitude: parseFloat(lat), longitude: parseFloat(lng) };
    }
    return null;
  },
};
