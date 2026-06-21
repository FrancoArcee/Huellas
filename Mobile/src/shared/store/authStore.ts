
import { create } from 'zustand';
import { api } from '../services/api';
import { storage } from '../services/storage';

export interface User {
  id: string;
  name: string;
  email: string;
  contact: string;
  contactType: string;
  profilePictureUrl?: string | null;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signUp: (userData: Omit<User, 'id'> & { password?: string }) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: async () => {
    try {
      const token = await storage.getToken();
      const user = await storage.getUser();

      if (token && user) {
        try {
          await api.get(`/users/${user.id}`);
          set({ user, token, isAuthenticated: true });
        } catch (err) {
          console.warn('La sesión del storage local no es válida en el servidor. Limpiando sesión...', err);
          await storage.clear();
          set({ user: null, token: null, isAuthenticated: false });
        }
      } else {
        set({ isAuthenticated: false });
      }
    } catch (error) {
      console.error('Error al inicializar sesión:', error);
      await storage.clear();
      set({ user: null, token: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      // Endpoint de inicio de sesión de Better Auth
      const response = await api.post('/api/auth/sign-in/email', {
        email,
        password,
      });

      const data = response.data;
      const token = data.token;
      const user = data.user;

      if (!token || !user) {
        throw new Error('Respuesta inválida del servidor de autenticación');
      }

      await storage.setToken(token);
      await storage.setUser(user);

      set({ user, token, isAuthenticated: true });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  signUp: async (userData) => {
    set({ isLoading: true });
    try {
      // Registro se realiza a través de POST /users en nuestro backend
      const response = await api.post('/users', userData);

      const data = response.data?.data;
      const token = data?.token;
      const user = data?.user;

      if (!token || !user) {
        throw new Error('Respuesta inválida del servidor al registrarse');
      }

      await storage.setToken(token);
      await storage.setUser(user);

      set({ user, token, isAuthenticated: true });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      // Opcional: Llamada al endpoint sign-out de Better Auth
      await api.post('/api/auth/sign-out').catch((err) => {
        console.warn('Better Auth sign-out request failed', err);
      });
    } catch (error) {
      console.error('Error during sign out call:', error);
    } finally {
      await storage.clear();
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
