// ───────────────────────────────────────────────
//  API — Tipos compartidos de respuesta
// ───────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}