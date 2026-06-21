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
