// ───────────────────────────────────────────────
//  User — Tipos compartidos
// ───────────────────────────────────────────────

/** Tipos de contacto disponibles */
export enum ContactType {
  WhatsApp  = "WhatsApp",
  Telegram  = "Telegram",
  Instagram = "Instagram",
  Discord   = "Discord",
  Facebook  = "Facebook",
  Messenger = "Messenger",
}

/** Union type derivado del enum para uso en runtime */
export type ContactTypeValues = `${ContactType}`;

/** Representación completa de un usuario (salida API) */
export interface User {
  id:              string;
  name:            string;
  email:           string;
  emailVerified:    boolean;
  image:           string | null;
  contact:         string;
  contactType:     ContactType;
  profilePictureUrl: string | null;
  createdAt:       string;
  updatedAt:       string;
}

/** Payload para crear un usuario (POST /users) */
export interface CreateUserDTO {
  name:              string;
  email:             string;
  password:          string;
  contact:           string;
  contactType:       ContactType;
  profilePictureUrl?: string;
}

/** Payload para actualizar un usuario (PUT /users/:id) */
export interface UpdateUserDTO {
  name?:              string;
  email?:             string;
  password?:          string;
  contact?:           string;
  contactType?:       ContactType;
  profilePictureUrl?: string;
}

/** Respuesta de autenticación (Better Auth) */
export interface AuthResponse {
  user:    User;
  session: {
    id:        string;
    token:     string;
    expiresAt: string;
  };
}