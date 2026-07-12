// ───────────────────────────────────────────────
//  Animal — Tipos compartidos
// ───────────────────────────────────────────────

export interface ClinicalHistoryItem {
  id: string;
  postId: string;
  type: 'VACUNACION' | 'DESPARASITACION' | 'CHEQUEO_PREVENTIVO' | 'OTRO';
  name: string;
  date: string; // ISO string
  veterinary: string;
  veterinarian: string;
  comprobante: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Animal {
  id: string;
  name: string;
  photoUri: string;
  distanceKm: number;
  type: string;
  gender: string;
  age: string;
  weightKg: number;
  latitude?: number;
  longitude?: number;
  clinicalHistory?: ClinicalHistoryItem[];
}