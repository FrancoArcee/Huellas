import axios from 'axios';
import { storage } from './storage';
import Constants from 'expo-constants';

const getBaseURL = (): string => {
  const url = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
  
  // En desarrollo, si apunta a localhost, reemplazamos con la IP de Metro para dispositivos físicos
  if (__DEV__ && url.includes('localhost')) {
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
      const ip = hostUri.split(':')[0];
      if (ip) {
        return url.replace('localhost', ip);
      }
    }
  }
  return url;
};

export const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar automáticamente el Bearer Token en cada solicitud
api.interceptors.request.use(
  async (config) => {
    const token = await storage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const [{ storage: dynamicStorage }, { useAuthStore }] = await Promise.all([
        import('./storage'),
        import('../store/authStore'),
      ]);

      await dynamicStorage.clear();
      useAuthStore.setState({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    }

    return Promise.reject(error);
  }
);
