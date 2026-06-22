import type { ImagePickerAsset } from 'expo-image-picker';
import { create } from 'zustand';
import {
  adminService,
  type AnimalPostPayload,
  type AnimalPostRecord,
} from '../services/adminService';

export interface Publicacion {
  id: string;
  nombre: string;
  fechaNacimiento: string;
  edad: string;
  tamano: string;
  ubicacion: string;
  peso: string;
  genero: string;
  castrado: string;
  descripcion: string;
  imagen: string;
  imagenes: string[];
}

export interface PublicacionForm {
  nombre: string;
  fechaNacimiento: string;
  edad: string;
  tamano: string;
  ubicacion: string;
  peso: string;
  genero: string;
  castrado: string;
  descripcion: string;
}

function formatBirthDate(value: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return [
    String(date.getUTCDate()).padStart(2, '0'),
    String(date.getUTCMonth() + 1).padStart(2, '0'),
    date.getUTCFullYear(),
  ].join('/');
}

function toIsoBirthDate(value: string): string | undefined {
  if (!value) return undefined;
  const [day, month, year] = value.split('/').map(Number);
  return new Date(Date.UTC(year!, month! - 1, day!)).toISOString();
}

function toPublicacion(post: AnimalPostRecord): Publicacion {
  const sizeLabels: Record<AnimalPostRecord['size'], string> = {
    small: 'Chico',
    medium: 'Mediano',
    large: 'Grande',
  };

  return {
    id: post.id,
    nombre: post.name,
    fechaNacimiento: formatBirthDate(post.birthDate),
    edad: String(post.age),
    tamano: sizeLabels[post.size],
    ubicacion: post.location,
    peso: String(post.weight),
    genero: post.gender === 'female' ? 'Hembra' : 'Macho',
    castrado: post.neutered ? 'Si' : 'No',
    descripcion: post.description ?? '',
    imagen: post.photosUrl[0] ?? '',
    imagenes: post.photosUrl,
  };
}

function toPayload(form: PublicacionForm): AnimalPostPayload {
  const sizes: Record<string, AnimalPostRecord['size']> = {
    Chico: 'small',
    Mediano: 'medium',
    Grande: 'large',
  };

  const birthDate = toIsoBirthDate(form.fechaNacimiento);
  return {
    name: form.nombre.trim(),
    age: Number(form.edad),
    weight: Number(form.peso),
    size: sizes[form.tamano] ?? 'medium',
    category: 'dog',
    gender: form.genero === 'Hembra' ? 'female' : 'male',
    neutered: form.castrado === 'Si',
    latitude: 0,
    longitude: 0,
    location: form.ubicacion.trim(),
    ...(birthDate ? { birthDate } : {}),
    ...(form.descripcion.trim() ? { description: form.descripcion.trim() } : {}),
  };
}

interface PublicacionesState {
  publicaciones: Publicacion[];
  isLoading: boolean;
  error: string | null;
  cargarPublicaciones: (userId: string) => Promise<void>;
  agregarPublicacion: (
    publicacion: PublicacionForm,
    photos: ImagePickerAsset[],
  ) => Promise<Publicacion>;
  editarPublicacion: (
    id: string,
    actualizada: PublicacionForm,
    photos: ImagePickerAsset[],
    existingPhotosUrl: string[],
  ) => Promise<Publicacion>;
  eliminarPublicacion: (id: string) => Promise<void>;
}

export const usePublicacionesStore = create<PublicacionesState>((set) => ({
  publicaciones: [],
  isLoading: false,
  error: null,

  cargarPublicaciones: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const posts = await adminService.listByUser(userId);
      set({ publicaciones: posts.map(toPublicacion) });
    } catch (error) {
      set({ error: 'No se pudieron cargar tus publicaciones' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  agregarPublicacion: async (nueva, photos) => {
    const created = toPublicacion(await adminService.create(toPayload(nueva), photos));
    set((state) => ({ publicaciones: [created, ...state.publicaciones] }));
    return created;
  },

  editarPublicacion: async (id, actualizada, photos, existingPhotosUrl) => {
    const updated = toPublicacion(
      await adminService.update(id, toPayload(actualizada), photos, existingPhotosUrl),
    );
    set((state) => ({
      publicaciones: state.publicaciones.map((post) => post.id === id ? updated : post),
    }));
    return updated;
  },

  eliminarPublicacion: async (id) => {
    await adminService.remove(id);
    set((state) => ({
      publicaciones: state.publicaciones.filter((post) => post.id !== id),
    }));
  },
}));
