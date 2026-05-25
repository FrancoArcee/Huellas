import { create } from 'zustand';

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
}
const MOCK_ROCKY: Publicacion[] = [
  {
    id: '1',
    nombre: 'Rocky',
    fechaNacimiento: '10/05/2022',
    edad: '2 años',
    tamano: 'Mediano',
    ubicacion: 'La Plata',
    peso: '15',
    genero: 'Macho',
    castrado: 'Castrado',
    descripcion: 'Un beagle súper juguetón.',
    imagen: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?q=80&w=500',
  },
];
interface PublicacionesState {
  publicaciones: Publicacion[];
  agregarPublicacion: (publicacion: Omit<Publicacion, 'id'>) => void;
  editarPublicacion: (id: string, actualizada: Partial<Publicacion>) => void;
  eliminarPublicacion: (id: string) => void;
}

export const usePublicacionesStore = create<PublicacionesState>((set) => ({
  publicaciones:  MOCK_ROCKY,

  agregarPublicacion: (nueva) =>
    set((state) => ({
      publicaciones: [
        ...state.publicaciones,
        { ...nueva, id: Math.random().toString(36).substring(2, 9) },
      ],
    })),

  editarPublicacion: (id, actualizada) =>
    set((state) => ({
      publicaciones: state.publicaciones.map((pub) =>
        pub.id === id ? { ...pub, ...actualizada } : pub
      ),
    })),

  eliminarPublicacion: (id) =>
    set((state) => ({
      publicaciones: state.publicaciones.filter((pub) => pub.id !== id),
    })),
}));