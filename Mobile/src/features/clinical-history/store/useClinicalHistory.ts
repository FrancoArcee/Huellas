// ───────────────────────────────────────────────
//  Clinical History Store — Zustand state manager
// ───────────────────────────────────────────────

import { create } from 'zustand';
import type { ImagePickerAsset } from 'expo-image-picker';
import type { ClinicalHistoryItem } from '@huellas/shared';
import { clinicalHistoryService, type ClinicalHistoryPayload } from '../services/clinicalHistoryService';
import { usePublicacionesStore } from '../../admin/store/publicaciones';

interface ClinicalHistoryState {
  items: ClinicalHistoryItem[];
  isLoading: boolean;
  error: string | null;
  fetchItems: (postId: string) => Promise<void>;
  createItem: (
    postId: string,
    payload: ClinicalHistoryPayload,
    file: ImagePickerAsset,
  ) => Promise<ClinicalHistoryItem>;
  updateItem: (
    postId: string,
    itemId: string,
    payload: ClinicalHistoryPayload,
    file: ImagePickerAsset | string,
  ) => Promise<ClinicalHistoryItem>;
  deleteItem: (postId: string, itemId: string) => Promise<void>;
}

export const useClinicalHistoryStore = create<ClinicalHistoryState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchItems: async (postId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await clinicalHistoryService.listByPost(postId);
      set({ items: data });

      usePublicacionesStore.setState((state) => ({
        publicaciones: state.publicaciones.map((p) =>
          p.id === postId
            ? { ...p, clinicalHistory: data }
            : p
        ),
      }));
    } catch (err: any) {
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  createItem: async (postId, payload, file) => {
    set({ isLoading: true, error: null });
    try {
      const created = await clinicalHistoryService.create(postId, payload, file);
      
      // Actualizar el estado local
      set((state) => ({ items: [...state.items, created] }));

      // Sincronizar con el store de publicaciones para refrescar el ícono de estado
      usePublicacionesStore.setState((state) => ({
        publicaciones: state.publicaciones.map((p) =>
          p.id === postId
            ? { ...p, clinicalHistory: [...p.clinicalHistory, created] }
            : p
        ),
      }));

      return created;
    } catch (err: any) {
      set({ error: 'No se pudo registrar el ítem en el historial.' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updateItem: async (postId, itemId, payload, file) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await clinicalHistoryService.update(postId, itemId, payload, file);
      
      // Actualizar el estado local
      set((state) => ({
        items: state.items.map((item) => (item.id === itemId ? updated : item)),
      }));

      // Sincronizar con el store de publicaciones
      usePublicacionesStore.setState((state) => ({
        publicaciones: state.publicaciones.map((p) =>
          p.id === postId
            ? {
                ...p,
                clinicalHistory: p.clinicalHistory.map((item) =>
                  item.id === itemId ? updated : item
                ),
              }
            : p
        ),
      }));

      return updated;
    } catch (err: any) {
      set({ error: 'No se pudo actualizar el registro médico.' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteItem: async (postId, itemId) => {
    set({ isLoading: true, error: null });
    try {
      await clinicalHistoryService.remove(postId, itemId);
      
      // Actualizar el estado local
      set((state) => ({
        items: state.items.filter((item) => item.id !== itemId),
      }));

      // Sincronizar con el store de publicaciones
      usePublicacionesStore.setState((state) => ({
        publicaciones: state.publicaciones.map((p) =>
          p.id === postId
            ? {
                ...p,
                clinicalHistory: p.clinicalHistory.filter((item) => item.id !== itemId),
              }
            : p
        ),
      }));
    } catch (err: any) {
      set({ error: 'No se pudo eliminar el registro médico.' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
}));
